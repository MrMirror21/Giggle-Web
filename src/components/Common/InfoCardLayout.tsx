import { ReactNode } from 'react';

type InfoCardLayoutProps = {
  icon: JSX.Element;
  title: string;
  children?: ReactNode;
  rightTopElement?: ReactNode;
};

const InfoCardLayout = ({
  icon,
  title,
  children,
  rightTopElement,
}: InfoCardLayoutProps) => {
  return (
    <section className="w-full py-6 px-4 bg-white rounded-lg">
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div>{icon}</div>
          <h3 className="head-3 text-[#191919]">{title}</h3>
        </div>
        {rightTopElement && (
          <div className="ml-auto self-end">{rightTopElement}</div>
        )}
      </div>
      {children && (
        <div className="mt-4 pt-4 border-t border-[#F8F8F8]">{children}</div>
      )}
    </section>
  );
};

export default InfoCardLayout;
