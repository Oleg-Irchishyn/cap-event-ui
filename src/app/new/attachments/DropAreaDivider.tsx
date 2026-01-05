import { DOCXIcon, DropAreaDividerBox, DropAreaDividerBoxContainer, PDFIcon } from './styles';

const DropAreaDivider: React.FC = () => {
  return (
    <DropAreaDividerBoxContainer>
      <DropAreaDividerBox>
        <PDFIcon />
        <DOCXIcon />
      </DropAreaDividerBox>
    </DropAreaDividerBoxContainer>
  );
};

export default DropAreaDivider;
