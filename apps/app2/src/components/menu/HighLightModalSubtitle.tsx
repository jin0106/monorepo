interface HighLightModalSubtitleProps {
  highLightText: string
  text: string
}
const HighLightModalSubtitle = ({ text, highLightText }: HighLightModalSubtitleProps) => {
  return (
    <div>
      <span className="text-warning">{highLightText}</span>
      <span className="text-base-content">{text}</span>
    </div>
  )
}

export default HighLightModalSubtitle
