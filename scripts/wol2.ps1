function Send-WakeOnLan {
    param (
        [Parameter(Mandatory=$true)]
        [string]$MacAddress,

        [Parameter(Mandatory=$false)]
        [string]$BroadcastAddress = "255.255.255.255",

        [Parameter(Mandatory=$false)]
        [int]$Port = 9
    )

    # 1. Очистка и преобразование MAC-адреса в байты
    $CleanMac = $MacAddress -replace "[:\-\.]"

    # ИСПРАВЛЕНИЕ: Строго типизируем результат конвейера как [byte[]]
    [byte[]]$MacBytes = ($CleanMac -split '(?<=\G.{2})' | Where-Object { $_ }) | ForEach-Object { 
        [byte]('0x' + $_) 
    }

    # Проверка длины MAC-адреса (должно быть 6 байт)
    if ($MacBytes.Length -ne 6) {
        Write-Error "Неверный формат MAC-адреса. Должно быть 6 байт. Проверьте входные данные."
        return
    }

    # 2. Создание Magic Packet
    $MagicPacket = New-Object System.Collections.Generic.List[byte]

    # Создание 6 байтов 0xFF (FF FF FF FF FF FF)
    [byte[]]$FFBytes = $(for ($i = 0; $i -lt 6; $i++) { 0xFF })
    $MagicPacket.AddRange($FFBytes)

    # Добавление 16 повторений MAC-адреса
    for ($i = 0; $i -lt 16; $i++) {
        # Теперь $MacBytes гарантированно является [byte[]] и AddRange работает.
        $MagicPacket.AddRange($MacBytes)
    }

    # 3. Отправка пакета через UDP
    try {
        $UdpClient = New-Object System.Net.Sockets.UdpClient
        $UdpClient.Connect($BroadcastAddress, $Port)
        
        [byte[]]$PacketToSend = $MagicPacket.ToArray()
        
        $BytesSent = $UdpClient.Send($PacketToSend, $PacketToSend.Length)
        
        $UdpClient.Close()

        Write-Host "✅ Magic Packet (Размер: $BytesSent байт) отправлен на $BroadcastAddress (Порт: $Port) для MAC: $MacAddress"
    }
    catch {
        Write-Error "Ошибка при отправке UDP-пакета: $($_.Exception.Message)"
    }
}
param(
    [Parameter(Mandatory=$true)]
    [string]$Mac
)

Send-WakeOnLan -MacAddress $Mac
