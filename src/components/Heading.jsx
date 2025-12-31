export default function Heading({ text, className, as }) {
  const Tag = as || "h3";
  return (
    <Tag
      className={`py-1.5 font-black uppercase -tracking-[0.32px] text-[#323232]  md:text-[1.30rem] md:-tracking-[0.48px] mb-1 ${className}`}
    >
      {text}
    </Tag>
  );
}   
