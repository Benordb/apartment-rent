"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ContractFormValues {
  rentalPeriod: number;
  paymentType: string;
  paymentAmount: number;
  deposit: number;
  utilityIncluded: string;
  others: string[];
}

export const CrContract = () => {
  const [contract, setContract] = useState<ContractFormValues | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedContract = localStorage.getItem("contract");
    if (storedContract) {
      setContract(JSON.parse(storedContract));
    }
  }, []);

  const sections = [
    { id: "goal", title: "1. Гэрээний зорилго" },
    { id: "duration", title: "2. Гэрээний хугацаа ба төлбөр" },
    { id: "deposit", title: "3. Барьцаа мөнгөний хэмжээ" },
    { id: "rights", title: "4. Түрээслүүлэгчийн үүрэг, эрх" },
    { id: "lessee", title: "5. Түрээслэгчийн үүрэг, хязгаарлалт" },
    { id: "disputes", title: "6. Зөрчил, алданги, маргааны шийдвэрлэл" },
    { id: "termination", title: "7. Гэрээ цуцлах нөхцөл" },
    {
      id: "validity",
      title: "8. Гэрээ хүчин төгөлдөр болох ба өөрчлөлт оруулах",
    },
    { id: "others", title: "9. Бусад" },
  ];

  const handleRenterContract = () => {
    localStorage.removeItem("contract");
    router.push("/");
    toast.success("Гэрээ амжилттай үүслээ");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-6 gap-10">
      <div className="flex-1 space-y-6">
        <h1 className="text-2xl font-bold mb-2">Түрээсийн гэрээ байгуулах</h1>

        {sections.map(({ id, title }) => (
          <div key={id} id={id} className="scroll-mt-24">
            <h2 className="text-lg font-bold mb-1 ">{title}</h2>
            <p className="text-sm text-gray-700 leading-relaxed font-light">
              {getContentById(id, contract)}
            </p>
          </div>
        ))}

        <div className="mt-6">
          <Label className="flex items-center space-x-2 text-sm">
            <Checkbox className="h-5 w-5 border border-black cursor-pointer" />
            <h1 className="font-light">Гэрээний нөхцөлтэй танилцсан</h1>
          </Label>
        </div>
      </div>
      <div className="flex flex-col print:hidden">
        <div className="border-[1px] h-full"></div>
      </div>
      <div className="w-full md:w-1/3 space-y-4 flex flex-col justify-between print:hidden">
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="hover:bg-[#7065F0]">
            ДАН баталгаажуулалт
          </Button>
          <Button
            onClick={handleRenterContract}
            className="text-black bg-white cursor-pointer hover:bg-[#7065F0] border"
          >
            Гэрээ байгуулах
          </Button>
        </div>
        <div className="justify-center flex">
          <Button
            onClick={handlePrint}
            variant="ghost"
            className="border hover:bg-[#7065F0] cursor-pointer hover:text-white"
          >
            📄 PDF татах
          </Button>
        </div>
      </div>
    </div>
  );
};

function getContentById(
  id: string,
  contract: ContractFormValues | null
): string {
  if (!contract) return "";

  switch (id) {
    case "goal":
      return `Энэхүү гэрээ нь хоёр талын харилцан тохиролцсон нөхцлийн дагуу тодорхой хугацаанд хөрөнгө түрээслэх, түүнийг ашиглахтай холбоотой эрх, үүрэг, хариуцлагыг зохицуулах зорилготой юм.  
Түрээслүүлэгч нь өөрийн өмчлөлд байгаа хөрөнгийг Түрээслэгчийн эзэмшил, ашиглалтанд шилжүүлж, харин Түрээслэгч нь тухайн хөрөнгийг зориулалтын дагуу ашиглаж, тохиролцсон хугацаанд түрээсийн төлбөрийг бүрэн төлөх үүрэгтэй.`;
    case "duration":
      return `Гэрээний хүчинтэй хугацаа нь гэрээнд тусгагдсан огнооноос эхлэн тодорхой сар буюу жилээр үргэлжилнэ.  
Түрээслэгч нь сар бүрийн ${
        contract.paymentAmount || "____"
      } төгрөгийн түрээсийн төлбөрийг хугацаанд нь төлөх бөгөөд нийт  ${
        contract.paymentAmount && contract.rentalPeriod
          ? contract.paymentAmount * contract.rentalPeriod
          : "____"
      } төгрөгийг гэрээний хугацаанд бүрэн барагдуулах үүрэгтэй.`;
    case "deposit":
      return `Түрээслэгч нь түрээсийн гэрээний дагуу ${
        contract.deposit || "____"
      } төгрөгийн барьцаа мөнгийг гэрээ байгуулсны дараа Түрээслүүлэгчид бүрэн төлөх үүрэгтэй.  
Гэрээний хугацаа дуусахад хөрөнгийг бүрэн бүтэн, ямар нэг эвдрэл гэмтэлгүйгээр буцаан өгсөн тохиолдолд барьцаа мөнгийг бүрэн буцаан олгоно.  
Хэрэв ямар нэгэн хохирол, төлбөрийн зөрчил гарсан тохиолдолд уг барьцаанаас нөхөн төлбөр суутгана.`;
    case "rights":
      return `Түрээслүүлэгч нь хөрөнгийг ашиглах боломжтой, эрхийн болон биеэ зөвшөөрсөн нөхцөлтэйгөөр түрээслэгчид хүлээлгэн өгөх үүрэгтэй. Мөн гэрээний үүрэг зөрчигдсөн тохиолдолд хохирлыг нөхөн төлүүлэх эрхтэй.`;
    case "lessee":
      return `Түрээслэгч нь хөрөнгийг зөвхөн гэрээнд заасан зориулалтын дагуу ашиглах, төлбөрийг хугацаанд нь төлөх, гэрээ дуусгавар болоход хөрөнгийг хэвийн байдалтайгаар буцаан өгөх үүрэгтэй.  
Түрээслэгч нь хөрөнгийн ашиглалттай холбоотой бүх зардлыг өөрөө хариуцах бөгөөд түрээслэсэн хөрөнгийг бусдад дамжуулах, худалдаалахыг хориглоно.`;
    case "disputes":
      return `Хэрэв гэрээний заалтыг зөрчвөл зөрчил гаргасан тал нь гэрээний нийт үнийн дүнгийн 0.1%-ийг хоног тутам алданги болгон төлөх үүрэгтэй.  
Маргаан гарсан тохиолдолд талууд эхлээд эвийн журмаар шийдвэрлэх бөгөөд боломжгүй бол арбитрын журмаар шийднэ.`;
    case "termination":
      return `Хэрвээ аль нэг тал гэрээний үүргээ биелүүлээгүй бол гэрээг нэг талын санаачлагаар цуцалж болно.  
Цуцлагдсан тохиолдолд буруутай тал хохирлыг барагдуулах ба Түрээслэгч нь 7 хоногийн дотор хөрөнгийг буцаан өгөх үүрэгтэй.`;
    case "validity":
      return `Гэрээ нь талууд гарын үсэг зурсан өдрөөс хүчин төгөлдөр үйлчилнэ.  
Нэмэлт, өөрчлөлтийг зөвхөн бичгээр, талуудын гарын үсгээр баталгаажуулж хийнэ.`;
    case "others":
      return `${contract.others.join(", ")}`;
    default:
      return "";
  }
}
