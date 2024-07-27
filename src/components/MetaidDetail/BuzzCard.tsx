/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetaidItem, PinDetail } from '@/utils/api';
import { environment } from '@/utils/envrionments';
import { Avatar } from '@mantine/core';
import { IconLink } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { isEmpty } from 'ramda';
// import {  isNil } from 'ramda';
// import { useQueries } from '@tanstack/react-query';

type Iprops = { pin: PinDetail; currentUserInfo: MetaidItem | undefined };

const BuzzCard = ({ pin, currentUserInfo }: Iprops) => {
  let summary = pin!.contentSummary;
  const isSummaryJson = summary.startsWith('{') && summary.endsWith('}');
  // console.log("isjson", isSummaryJson);
  // console.log("summary", summary);
  const parseSummary = isSummaryJson ? JSON.parse(summary) : {};

  summary = isSummaryJson ? parseSummary.content : summary;

  const metaidPrefix = (currentUserInfo?.metaid ?? '').slice(0, 6);

  //   const attachPids =
  //     isSummaryJson && !isEmpty(parseSummary?.attachments ?? [])
  //       ? (parseSummary?.attachments ?? []).map(
  //           (d: string) => d.split('metafile://')[1]
  //         )
  //       : [];
  //   const attachData = useQueries({
  //     queries: attachPids.map((id: string) => {
  //       return {
  //         queryKey: ['post', id],
  //         queryFn: () => metaidService.getPinDetail({ id }),
  //       };
  //     }),
  //     combine: (results: any) => {
  //       return {
  //         data: results.map((result: any) => result.data),
  //         pending: results.some((result: any) => result.isPending),
  //       };
  //     },
  //   });

  const handleSpecial = (summary: string) => {
    summary = summary
      .replace('<metaid_flag>', 'metaid_flag')
      .replace('<operation>', 'operation')
      .replace('<path>', 'path')
      .replace('<encryption>', 'encryption')
      .replace('<version>', 'version')
      .replace('<content-type>', 'content-type')
      .replace('<payload>', 'payload');
    return summary;
  };

  const detectUrl = (summary: string) => {
    const urlReg = /(https?:\/\/[^\s]+)/g;

    const urls = summary.match(urlReg);

    if (urls) {
      urls.forEach(function (url) {
        // const replacement = (
        //   <div
        //     dangerouslySetInnerHTML={{
        //       __html: `<a href="${url}" style="text-decoration: underline;">${url}</a>`,
        //     }}
        //   />
        // );
        summary = summary.replace(
          url,
          `<a href="${url}" target="_blank" style="text-decoration: underline;">${url}</a>`
        );
      });
    }

    return summary;
  };

  const renderBasicSummary = (summary: string) => {
    return (
      <div>
        {(summary ?? '').split('\n').map((line, index) => (
          <span key={index} className='break-all'>
            <div
              dangerouslySetInnerHTML={{
                __html: handleSpecial(detectUrl(line)),
              }}
            />

            <br />
          </span>
        ))}
      </div>
    );
  };

  const renderSummary = (summary: string, showDetail: boolean) => {
    return (
      <>
        {showDetail ? (
          <>
            {(summary ?? '').length < 800 ? (
              renderBasicSummary(summary)
            ) : (
              <div className=''>
                {renderBasicSummary(summary.slice(0, 800) + '...')}
                <span className=' text-main'>{' more >>'}</span>
              </div>
            )}
          </>
        ) : (
          renderBasicSummary(summary)
        )}
      </>
    );
  };
  //   const handleImagePreview = (pinId: string) => {
  //     const preview_modal = document.getElementById(
  //       `preview_modal_${pinId}`
  //     ) as HTMLDialogElement;
  //     preview_modal.showModal();
  //   };

  //   const renderImages = (pinIds: string[]) => {
  //     if (pinIds.length === 1) {
  //       return (
  //         <>
  //           <img
  //             onClick={() => {
  //               handleImagePreview(pinIds[0]);
  //             }}
  //             className='image h-[60%] w-[60%] !rounded-md'
  //             style={{
  //               objectFit: 'cover',
  //               objectPosition: 'center',
  //             }}
  //             src={`${environment.base_man_url}/content/${pinIds[0]}`}
  //             alt=''
  //             key={pinIds[0]}
  //           />
  //           <dialog id={`preview_modal_${pinIds[0]}`} className='modal  !z-20'>
  //             <div className='modal-box bg-[#191C20] !z-20 py-5  w-[90%] lg:w-[50%]'>
  //               <form method='dialog'>
  //                 {/* if there is a button in form, it will close the modal */}
  //                 <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
  //                   ✕
  //                 </button>
  //               </form>
  //               <h3 className='font-medium text-white text-[16px] text-center'>
  //                 Image Preview
  //               </h3>

  //               <img
  //                 className='image w-auto mt-6 !rounded-md'
  //                 style={{
  //                   objectFit: 'cover',
  //                   objectPosition: 'center',
  //                   width: '100%',
  //                   height: '100%',
  //                 }}
  //                 src={`${environment.base_man_url}/content/${pinIds[0]}`}
  //                 alt=''
  //               />
  //             </div>
  //             <form method='dialog' className='modal-backdrop'>
  //               <button>close</button>
  //             </form>
  //           </dialog>
  //         </>
  //       );
  //     }
  //     return (
  //       <>
  //         <div className='grid grid-cols-3 gap-2 place-items-center'>
  //           {pinIds.map((pinId) => {
  //             return (
  //               <div key={pinId}>
  //                 <img
  //                   className='image !rounded-md'
  //                   onClick={() => {
  //                     handleImagePreview(pinId);
  //                   }}
  //                   style={{
  //                     objectFit: 'cover',
  //                     // objectPosition: 'center',

  //                     width: '220px',
  //                     height: '200px',
  //                   }}
  //                   src={`${environment.base_man_url}/content/${pinId}`}
  //                   alt=''
  //                   key={pinId}
  //                 />
  //                 <dialog id={`preview_modal_${pinId}`} className='modal  !z-20'>
  //                   <div className='modal-box bg-[#191C20] !z-20 py-5 w-[90%] lg:w-[50%]'>
  //                     <form method='dialog'>
  //                       {/* if there is a button in form, it will close the modal */}
  //                       <button className='border border-white text-white btn btn-xs btn-circle absolute right-5 top-5.5'>
  //                         ✕
  //                       </button>
  //                     </form>
  //                     <h3 className='font-medium text-white text-[16px] text-center'>
  //                       Image Preview
  //                     </h3>
  //                     <img
  //                       className='image h-[48px] w-auto mt-6 !rounded-md'
  //                       style={{
  //                         objectFit: 'cover',
  //                         objectPosition: 'center',
  //                         width: '100%',
  //                         height: '100%',
  //                       }}
  //                       src={`${environment.base_man_url}/content/${pinId}`}
  //                       alt=''
  //                     />
  //                   </div>
  //                   <form method='dialog' className='modal-backdrop'>
  //                     <button>close</button>
  //                   </form>
  //                 </dialog>
  //               </div>
  //             );
  //           })}
  //         </div>
  //       </>
  //     );
  //   };

  return (
    <div className='border border-[#4C433A] rounded-md p-4'>
      <div className='flex  gap-4 items-center mb-2'>
        <Avatar
          radius='100%'
          size={'lg'}
          src={
            !isEmpty(currentUserInfo?.avatar ?? '')
              ? environment.base_man_url + currentUserInfo?.avatar
              : null
          }
        >
          {(currentUserInfo?.name ?? '').slice(0, 1)}
        </Avatar>
        <div className='flex flex-col gap-1 self-center'>
          <div className='font-bold font-mono text-[12px] md:text-[16px] '>
            {currentUserInfo?.name ?? `MetaID-User-${metaidPrefix}`}
          </div>
          <div className='flex gap-2 text-[12px] '>
            <div>{`MetaID:  ${metaidPrefix}`}</div>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {renderSummary(summary, true)}
        {/* {!isEmpty(attachPids) && (
          <div className='mt-2'>
            {!attachData.pending &&
              !isEmpty(
                (attachData?.data ?? []).filter((d: any) => !isNil(d))
              ) &&
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderImages(attachPids)}
          </div>
        )} */}
      </div>

      <div className='flex justify-between text-gray '>
        <div
          className='flex gap-2 items-center hover:text-slate-300 md:text-md text-xs'
          onClick={() => {
            window.open(
              `https://mempool.space/${
                environment.network === 'mainnet' ? '' : 'testnet/'
              }tx/${pin.genesisTransaction}`,
              '_blank'
            );
          }}
        >
          <IconLink size={12} />
          <div>{pin.genesisTransaction.slice(0, 8) + '...'}</div>
        </div>
        <div className='flex gap-2 md:text-md text-xs items-center'>
          {pin?.number === -1 && (
            <div
              className='tooltip tooltip-secondary mt-0.5'
              data-tip='This buzz(PIN) is still in the mempool...'
            >
              <span className='loading loading-ring loading-sm cursor-pointer'></span>
            </div>
          )}

          <div>{dayjs.unix(pin.timestamp).format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
      </div>
    </div>
  );
};

export default BuzzCard;
