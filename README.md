# diskless-boot-ts: a diskless network boot server (TypeScript prototype)

This is the old TypeScript version of my diskless boot system, built from December 2025 to
March 2026. It lets a room of computers with no local drives boot Windows over the network: each PC
boots via PXE, gets an iPXE script from this server and starts from its own iSCSI disk. The system
was later rewritten in Rust, and that version is the finished one. This repository is the prototype
where the approach was worked out.

## How it works

```
PC powers on (Wake-on-LAN from the API, or the button)
   │
   ├─ PXE: the DHCP server points it to ipxe.efi ──► iPXE starts
   │
   ├─ iPXE: GET http://server/            ──► autoexec.ipxe
   │        GET http://server/boot?mac=…  ──► script built for this PC:
   │                                          the PC is looked up by MAC in PostgreSQL
   │                                          and gets its own iSCSI target name (IQN)
   │
   └─ sanboot iscsi:<server>::::iqn.2025-12.local.pccontrol:<pc name>  ──► Windows boots
```

- **PXE / iPXE over HTTP** (`src/pxeHttp`): serves the iPXE files from `files/` and generates a boot
  script per computer. Unknown MACs get a message and a reboot. Static files are served with a
  path-traversal check.
- **Computers, groups and disks** (`src/computers`, `src/computer_groups`, `src/storage_resources`):
  each computer has a MAC, a boot image and a write-back disk. Groups give defaults for both, so a
  whole row of PCs can share one image.
- **Fresh disk per session** (`scripts/StartSession.ps1`, from the earlier power-on API): on Windows
  Server, deletes the PC's old differencing VHDX, creates a new one on top of the golden image and
  enables it in the iSCSI Target Server, so every session starts clean.
- **Power** (`src/wol`, `scripts/wol2.ps1`): Wake-on-LAN magic packets built by hand, and remote
  shutdown.
- **Client time** (`src/clients`, `src/tarif`): client accounts (bcrypt passwords) buy time packages.
  A scheduler takes one minute off every active client each minute and logs when time runs out.
- PostgreSQL through Drizzle ORM with SQL migrations. HTML docs for the API and the architecture are
  in `docs/`.

The first commits are shared with [pc-control](https://github.com/AkimovRatmir/pc-control), the
power-on API this project grew out of.

## API

| Path | What it does |
|---|---|
| `GET /boot?mac=` · `GET /*` | iPXE boot script for a PC · iPXE files |
| `/computers` · `/computer-groups` · `/storage-resources` | CRUD |
| `/clients` · `GET /clients/lease/:id` · `POST /clients/:id/purchase/:tarifId` | Clients, time left, buying time |
| `/tarifs` | Time packages: name, minutes, price |
| `POST /wol/turn-on` · `POST /wol/turn-off` | Wake-on-LAN · remote shutdown |

## Stack

TypeScript · NestJS · @nestjs/schedule · PostgreSQL · Drizzle ORM · Docker · iPXE · iSCSI ·
PowerShell · Windows Server iSCSI Target · Hyper-V VHDX

## Running it

The server has to sit on the same network as the PCs, next to a Windows Server with the iSCSI
Target Server role. A DHCP server must give PXE clients option 66 (this server) and option 67
(`ipxe.efi`), for example my [dhcpNode](https://github.com/AkimovRatmir/dhcpNode).

```bash
npm install
cp docker/.env.example docker/.env      # database password
docker compose -f docker/docker-compose.yml up -d
cp .env.example .env                    # DATABASE_URL with the same password
npx drizzle-kit migrate
# download ipxe.efi from https://ipxe.org into files/
sudo npm run start:dev                  # listens on port 80
```

The iSCSI server address (`192.168.2.1`) and the script paths are set in the code.

## Not done yet

There's no authentication on the API, and the remote shutdown script isn't included.

## Author

**Ratmir Akimov**: [github.com/AkimovRatmir](https://github.com/AkimovRatmir)

## License

All rights reserved. The code is published for viewing only. See [LICENSE](LICENSE).
