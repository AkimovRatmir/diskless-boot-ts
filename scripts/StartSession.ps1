function Start-IscsiClientSession {
    param(
        # Имя компьютера (например, PC03). Используется как имя Target и имя VHDX.
        [Parameter(Mandatory=$true)]
        [string]$ComputerName,

        # MAC-адрес компьютера для Wake-on-LAN.
        [Parameter(Mandatory=$true)]
        [string]$MACAddress,
        
        # Путь, где хранятся все дифференциальные VHDX.
        [string]$VHDXDirectory = "C:\VHDs\Diffs",

        # Путь к вашему золотому образу. Обязателен для создания нового Diff VHDX.
        [Parameter(Mandatory=$true)]
        [string]$BaseVHDXPath,

        # Путь к вашему скрипту Wake-on-LAN
        [string]$WoLScriptPath = "C:\Project\pccontrol\scripts\wol2.ps1"
    )

    # --- 1. Формирование переменных пути ---
    $VHDXDirectory = $VHDXDirectory.TrimEnd('\')
    $DiffVHDXFileName = "$ComputerName.vhdx"
    $DiffVHDXPath = "$VHDXDirectory\$DiffVHDXFileName"
    $TargetName = "Target-$ComputerName" # Уникальное имя iSCSI Target (только для информации)

    Write-Host "----------------------------------------------------"
    Write-Host "ℹ️ НАЧАЛО СЕССИИ ДЛЯ $ComputerName (MAC: $MACAddress)"
    Write-Host "----------------------------------------------------"

    # --- 2. ПРОВЕРКА И УДАЛЕНИЕ СТАРОГО VHDX (Критический блок с фиксами) ---
    Write-Host "1/3. Проверка и удаление старого дифференциального VHDX..."
    
    # 💥 ШАГ 1: Освобождение iSCSI Target
    # *** МЫ НЕ ТРОГАЕМ iSCSI КОНФИГУРАЦИЮ. РАБОТАЕМ ТОЛЬКО С ФАЙЛОМ. ***
    Write-Host "    ℹ️ Проверка существования дифференциального VHDX..."

    # 💥 ШАГ 2: КРИТИЧЕСКИЙ ФИКС БЛОКИРОВКИ VHDX
    # Этот шаг гарантирует, что хост Windows Server отпустит файл .vhdx
    if (Test-Path $DiffVHDXPath) {
        Write-Host "    ℹ️ Принудительное отключение VHDX, чтобы освободить файл ($DiffVHDXPath)..."
        try {
            # ЭТОТ КОМАНДЛЕТ ОСВОБОЖДАЕТ ФАЙЛ, ЧТОБЫ ЕГО МОЖНО БЫЛО УДАЛИТЬ. 
            # Он будет пытаться отключить только *этот* VHDX (если он зарегистрирован).
            Set-IscsiVirtualDisk -Path $DiffVHDXPath -Enable $false -ErrorAction Stop | Out-Null
            Write-Host "    ✅ VHDX успешно отключен от службы iSCSI хоста."
        }
        catch {
            # Это предупреждение является нормальным, если диск не был зарегистрирован как iSCSI Virtual Disk.
            Write-Warning "    ⚠️ Ошибка при Set-IscsiVirtualDisk -Enable \$False. Пробуем удалить файл."
        }

        # 💥 ШАГ 3: Удаление физического файла VHDX
        # Добавляем небольшую паузу на случай асинхронности службы iSCSI
        Start-Sleep -Milliseconds 500
        
        try {
            # Агрессивное удаление файла
            Remove-Item -Path $DiffVHDXPath -Force -ErrorAction Stop
            Write-Host "✅ Старый VHDX ($DiffVHDXPath) успешно удален."
        }
        catch {
            Write-Error "❌ Критическая ошибка: Файл $DiffVHDXPath все еще занят и не может быть удален."
            return
        }
    } else {
        Write-Host "ℹ️ Старый VHDX не найден. Продолжение."
    }

    # --- 3. КРИТИЧЕСКИЙ ШАГ: СОЗДАНИЕ НОВОГО VHDX И АКТИВАЦИЯ ---
    Write-Host "2/3. Создание нового дифференциального VHDX и активация..."
    
    if (-not (Test-Path $BaseVHDXPath)) {
        Write-Error "❌ Ошибка: Базовый VHDX ($BaseVHDXPath) не найден. Невозможно создать новый дифференциальный диск."
        return
    }

    try {
        # 1. Создаем новый VHDX, привязанный к базовому образу (Операция с файлом)
        New-VHD -ParentPath $BaseVHDXPath -Path $DiffVHDXPath -Differencing | Out-Null
        
        # 2. Активируем его (Он уже зарегистрирован, так как Target маппинг существует)
        Set-IscsiVirtualDisk -Path $DiffVHDXPath -Enable $true -ErrorAction Stop | Out-Null

        # 3. Target и маппинги не трогаем.

        Write-Host "✅ Новый VHDX успешно создан и активирован для iSCSI Service."
        
        # Пауза для стабилизации файла на диске
        Start-Sleep -Seconds 3 
    }
    catch {
        Write-Error "❌ Ошибка при создании или активации нового VHDX: $($_.Exception.Message)"
        return
    }

    # --- 4. ЗАПУСК ФУНКЦИИ WAKE-ON-LAN ---
    Write-Host "3/3. Запуск функции WoL..."

    if (Test-Path $WoLScriptPath) {
        try {
            # Загружаем функцию WoL с помощью Dot-Sourcing
            . $WoLScriptPath
            
            # Вызываем загруженную функцию
            Send-WakeOnLan -MACAddress $MACAddress
            Write-Host "✅ Команда WoL успешно отправлена для MAC: $MACAddress."
        }
        catch {
            Write-Error "❌ Error execuring WoL. Check content of wol2.ps1."
        }
    } else {
        Write-Error "❌ Скрипт WoL не найден. Компьютер не будет включен."
    }

    Write-Host "--- ✅ ПРОЦЕСС ЗАВЕРШЕН ---"
}

# Start-IscsiClientSession -ComputerName $ComputerName -MACAddress $MACAddress -BaseVHDXPath $BaseVHDXPath
