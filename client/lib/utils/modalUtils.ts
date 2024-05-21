import { MainContextType } from "@/providers/mainContext";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getModalStatus(context: MainContextType,modalId: string) {
  // console.log('getModalStatus')
  if (!context.modalStatus) return false;

  let modalStatus = context?.modalStatus?.find(x=>x.modalId == modalId);

  // if(!modalStatus){
  //   let newModalStatus = addModalStatus(context,modalId);
  //   return newModalStatus;
  // }

  return modalStatus;
}

function addModalStatus(context: MainContextType,modalId: string, mode: boolean = false) {
  // console.log('addModalStatus')
  let modalStatus = context?.modalStatus?.find(x=>x.modalId == modalId);

  if(modalStatus) return;

  let newModalStatus = { modalId, mode };
  context.setModalStatus((prev) => [...(prev || []), newModalStatus]);
}

function updateModalStatus(context: MainContextType, modalId: string, mode: boolean) {
  // console.log('updateModalStatus')

  let modalStatus = getModalStatus(context,modalId);

  if (!modalStatus) 
    {
      addModalStatus(context,modalId,mode);
      return;
    }

  modalStatus.mode = mode;
  context.setModalStatus((prev) => [...(prev || [])]);
}

export function shouldOpenModal(context: MainContextType,modalId: string) {
    // console.log('shouldOpenModal')
  if (!context.modalStatus) return false;

  let modalStatus = getModalStatus(context,modalId);

  if(!modalStatus) return false;

  let shouldOpen = modalStatus.mode === true;
  return shouldOpen;
}

export function shouldCloseModal(context: MainContextType,modalId: string) {
  // console.log('shouldCloseModal')
  if (!context.modalStatus) return false;

  let modalStatus = getModalStatus(context,modalId);

  if(!modalStatus) return true;

  let shouldClose = modalStatus.mode === false;
}

export function openModal(context: MainContextType,modalId: string) {
  // console.log('openModal')
  updateModalStatus(context,modalId,true);

}

export function closeModal(context: MainContextType,modalId: string) {
  // console.log('closeModal')
  updateModalStatus(context,modalId,false);
}
