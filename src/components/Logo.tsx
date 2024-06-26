import Image from "next/image";

interface IProps {
  title?: string | undefined;
}

const Logo = ({ title = undefined }: IProps) => {
  return (
    <div className="x-logo">
      <Image
        src="/icons/ideas.png"
        alt="Ideas"
        width={64}
        height={64}
        priority
      />

      {title && <div className="x-logo-title">{title}</div>}
    </div>
  );
};

export default Logo;
