import { closeModal, shouldOpenModal } from '@/lib/utils/modalUtils';
import { useMainContext } from '@/providers/mainContext';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { useTranslations } from 'next-intl';

const HowToPlayModal = () => {

  const t = useTranslations("HowToPlay");
  const context = useMainContext();

  const shouldOpen = shouldOpenModal(context, 'howToPlayModal');

  return shouldOpen ? (
    <Dialog open={true} onOpenChange={() => closeModal(context, 'howToPlayModal')}>
      <DialogContent>
        <div className="how-to-play-modal bg-white rounded-lg p-6 max-w-3xl mx-auto mt-10 ">
          <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{t("subTitle1")}</h3>
            <p className="text-gray-700">{t("subDesc1")}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{t("subTitle2")}</h3>
            <p className="text-gray-700">{t("subDesc2")}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{t("subTitle3")}</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li>{t("li1")}</li>
              <li>{t("li2")}</li>
              <li>{t("li3")}</li>
              <li>{t("li4")}</li>
            </ul>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{t("subTitle4")}</h3>
            <p className="text-gray-700">{t("subDesc4")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
}

export default HowToPlayModal