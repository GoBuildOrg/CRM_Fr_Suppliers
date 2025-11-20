import { getQuotationById } from "@/actions/quotations";
import { QuotationDetailsClient } from "@/components/quotations/quotation-details-client";

export default async function QuotationDetailsPage({
    params,
}: {
    params: { id: string };
}) {
    const quotation = await getQuotationById(params.id);

    return <QuotationDetailsClient quotation={quotation} />;
}
