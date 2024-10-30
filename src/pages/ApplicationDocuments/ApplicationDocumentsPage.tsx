import BottomButtonPanel from '@/components/Common/BottomButtonPanel';
import Button from '@/components/Common/Button';
import BaseHeader from '@/components/Common/Header/BaseHeader';
import DocumentCardList from '@/components/Document/DocumentCardList';
import { DocumentsSummaryResponse } from '@/types/api/document';

const mockDocumentsSummaryResponse: DocumentsSummaryResponse = {
  part_time_employment_permits: null,
  standard_labor_contract: {
    id: 2001,
    hwp_url: 'https://example.com/contracts/standard_2001.hwp',
    word_url: 'https://example.com/contracts/standard_2001.docx',
    status: 'BEFORE_CONFIRMATION',
  },
  integrated_application: {
    id: 3001,
    hwp_url: 'https://example.com/applications/integrated_3001.hwp',
    word_url: 'https://example.com/applications/integrated_3001.docx',
    status: null,
  },
};

const ApplicationDocumentsPage = () => {
  {
    /*
  integrated_application: {
    id: 3001,
    hwp_url: 'https://example.com/applications/integrated_3001.hwp',
    word_url: 'https://example.com/applications/integrated_3001.docx',
  },
    */
  }
  return (
    <div>
      <BaseHeader
        hasBackButton={true}
        hasMenuButton={true}
        title="Application Documents"
      />
      <DocumentCardList documents={mockDocumentsSummaryResponse} />
      <BottomButtonPanel>
        <Button
          type="large"
          bgColor="bg-[#F4F4F9]"
          fontColor="text-[#bdbdbd]"
          isBorder={false}
          title="Next"
        />
      </BottomButtonPanel>
    </div>
  );
};

export default ApplicationDocumentsPage;
