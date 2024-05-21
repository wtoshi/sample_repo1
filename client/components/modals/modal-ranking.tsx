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

const RankingModal = () => {

  const t = useTranslations("Rankings");
  const context = useMainContext();

  const shouldOpen = shouldOpenModal(context, 'ranksModal');

  return shouldOpen ? (
    <Dialog open={true} onOpenChange={() => closeModal(context, 'ranksModal')}>
      <DialogContent>
        <div className="rankings-modal bg-white rounded-lg p-6 max-w-3xl mx-auto mt-10 ">
          <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{t("subTitle1")}</h3>
            <p className="text-gray-700">{t("subDesc1")}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold">{t("subTitle1")}</h3>
            <ul className="list-disc list-inside text-gray-700">
              <li><span className="font-semibold">Beginner:</span> 0 - 99 {t("points")}</li>
              <li><span className="font-semibold">Novice:</span> 100 - 199 {t("points")}</li>
              <li><span className="font-semibold">Okay:</span> 200 - 349 {t("points")}</li>
              <li><span className="font-semibold">Good:</span> 350 - 599 {t("points")}</li>
              <li><span className="font-semibold">Solid:</span> 600 - 1099 {t("points")}</li>
              <li><span className="font-semibold">Nice:</span> 1100 - 2099 {t("points")}</li>
              <li><span className="font-semibold">Great:</span> 2100 - 4249 {t("points")}</li>
              <li><span className="font-semibold">Amazing:</span> 4250 - 7499 {t("points")}</li>
              <li><span className="font-semibold">Genius:</span> 7500 - 9999 {t("points")}</li>
              <li><span className="font-semibold">Master:</span> 10000+ {t("points")}</li>
            </ul>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  ) : null;
}

export default RankingModal