import {
  IntegratedApplicationData,
  IntegratedApplicationField,
} from '@/types/api/document';
import { propertyToString } from '@/utils/document';
import { renderMap } from '@/utils/map';
import { GiggleAddress } from '@/types/api/users';
import { IntegratedApplicationPropertyInfo } from '@/constants/documents';
import { Fragment } from 'react/jsx-runtime';

type IntegratedApplicationFormProps = {
  document?: IntegratedApplicationData;
};

const IntegratedApplicationPreview = ({
  document,
}: IntegratedApplicationFormProps) => {
  // 공통 타이틀 렌더링 함수
  const renderTitle = (key: string) => (
    <p className="button-14-semibold text-text-alternative">
      {
        IntegratedApplicationPropertyInfo[key as IntegratedApplicationField]
          .name
      }
    </p>
  );

  // 기본 값 렌더링 컴포넌트
  const DefaultValueRenderer = ({ value }: { value: unknown }) => (
    <div className="w-full self-stretch flex items-start justify-start body-14-regular text-primary-dark">
      {propertyToString(String(value)) === 'Null'
        ? 'none'
        : propertyToString(String(value))}
    </div>
  );

  // 각 필드 타입별 렌더러 컴포넌트 매핑
  const renderFieldContent = (key: string, value: unknown) => {
    // 각 특수 케이스별 렌더링
    switch (key) {
      case IntegratedApplicationField.ADDRESS:
        return renderMap(value as GiggleAddress);
      case IntegratedApplicationField.IS_ACCREDITED:
        return (
          <div className="w-full self-stretch flex items-start justify-start body-14-regular text-primary-dark">
            {value
              ? 'Accredited school by Education Office'
              : 'Non-accredited, Alternative school'}
          </div>
        );
      case IntegratedApplicationField.SIGNATURE_BASE64:
        return (
          <div className="flex flex-col gap-4">
            <div className="border border-border-alternative rounded-lg">
              {value !== '' && (
                <img
                  src={`data:image/svg+xml;base64,${value}`}
                  className="w-full h-full object-cover bg-white rounded-lg"
                  alt="signature preview"
                />
              )}
            </div>
          </div>
        );
      default:
        return <DefaultValueRenderer value={value} />;
    }
  };

  if (!document) return null;

  return (
    <div className="w-full relative rounded-lg flex flex-col items center justify-center p-4 text-left caption-12-regular bg-white">
      <div className="w-full self-stretch flex flex-col items-start justify-center">
        <div className="w-full self-stretch flex flex-col items-center justify-start text-left pt-4 gap-3">
          {Object.entries(document).map(([key, value]) => (
            <Fragment key={key}>
              <div className="w-full flex flex-col gap-1">
                {renderTitle(key)}
                {renderFieldContent(key, value)}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegratedApplicationPreview;
