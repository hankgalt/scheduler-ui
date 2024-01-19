import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../lib/utils/hooks';
import { appState } from '../../state/app-state';

export const ModalWithStoreHOC = (ModalComponent: any, modalType: string) => {
  return (props: any) => {
    const { modal } = useAppSelector(appState);
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (modal && modal.type === modalType) {
        if (!open) setOpen(true);
      } else {
        setOpen(false);
      }
    }, [modal]);

    if (!open || !modal || modal?.type !== modalType) return <></>;

    return <ModalComponent {...props} type={modalType} open={open} />;
  };
};
