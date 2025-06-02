import { TColumnsTable } from '@renderer/types'
import type { Proxy } from '@vitechgroup/mkt-proxy-client'
export const configTableProxy = (): TColumnsTable<Proxy> => {
  return [
    {
      key: 'host',
      name: 'Proxy',
      resizable: true,
      width: 'auto',
      renderCell: ({ row: { host, port, username, password } }): string => {
        return `${host}:${port}:${username}:${password}`
      }
    },
    {
      key: 'ipsss',
      name: 'ip',
      resizable: true,
      width: 'auto',
      renderCell: ({ row: { host } }): string => {
        return `${host}`
      }
    },
    {
      key: 'profilesss',
      name: 'quantity_profile',
      resizable: true,
      width: 'auto',
      renderCell: ({ row: { profileAssign } }): string => {
        return `${profileAssign}`
      }
    },
    {
      key: 'protocol',
      name: 'protocol_support',
      resizable: true,
      width: 'auto'
    },
    {
      key: 'proxyType',
      name: 'proxy_type',
      resizable: true,
      width: 'auto'
    },
    {
      key: 'country',
      name: 'account_key.address',
      resizable: true,
      width: 'auto'
    },
    {
      key: 'timezone',
      name: 'nation',
      resizable: true,
      width: 'auto'
    },
    {
      key: 'statuss',
      name: 'account_key.status',
      sortable: true,
      resizable: true,
      width: 200,
      renderCell: ({ row: { status } }) => (
        <span>
          {status === 'Live' ? (
            <p className="text-[#00ab55] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#DEFDD7]">
              Live
            </p>
          ) : (
            <p className="text-[#ef4444] w-[70px] px-3 py-[2px] m-auto !font-bold text-left rounded-xl bg-[#FFE2E2]">
              Die
            </p>
          )}
        </span>
      )
    }
    // {
    //   key: 'tags_feauture_detail_update_remove',
    //   name: 'action_function',
    //   resizable: true,
    //   width: 'auto',
    //   renderCell(): JSX.Element {
    //     return (
    //       <Box className="flex flex-row gap-3">
    //         <ActionIcon
    //           variant="outline"
    //           aria-label="View"
    //           radius={'100%'}
    //           className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white-light hover:border-current"
    //         >
    //           <BiSolidDetail style={{ width: '70%', height: '70%' }} />
    //         </ActionIcon>
    //         <ActionIcon
    //           variant="outline"
    //           aria-label="Download"
    //           radius={'100%'}
    //           className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white-light hover:border-current"
    //         >
    //           <AiOutlineEdit style={{ width: '70%', height: '70%' }} />
    //         </ActionIcon>
    //         <ActionIcon
    //           variant="outline"
    //           aria-label="Download"
    //           radius={'100%'}
    //           className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white-light hover:border-current"
    //         >
    //           <IoTrashOutline style={{ width: '70%', height: '70%' }} />
    //         </ActionIcon>
    //       </Box>
    //     )
    //   }
    // }
  ]
}
