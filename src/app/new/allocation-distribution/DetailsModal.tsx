import styled from 'styled-components';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { FC } from 'react';
import { DistributionRow } from '@/app/new/allocation-distribution/types';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { TextArea, TextAreaContainer, Title } from '@/app/new/styles';

type Props = {
  details: DistributionRow;
  closeModal: () => void;
};

const DetailsModal: FC<Props> = ({ details, closeModal }) => {
  return (
    <Wrapper>
      <ModalContainer>
        <Title>Investor Details</Title>
        <TextAreaContainer>
          <TextArea
            data-testid={prepareDataTestId('textarea', 'detail-modal')}
            name="allocation-payload"
            rows={4}
            value={details.dataPoints}
            readOnly
            style={{ maxHeight: '400px', margin: '20px 0' }}
          />
        </TextAreaContainer>
        <Button
          style={{ justifySelf: 'flex-end' }}
          width="auto"
          onClick={closeModal}
          buttonTheme={BUTTON_THEMES.secondary}
          testId="close-details"
        >
          Close
        </Button>
      </ModalContainer>
    </Wrapper>
  );
};

export default DetailsModal;

const Wrapper = styled.div(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}));

const ModalContainer = styled.div({
  background: 'white',
  padding: '20px',
  borderRadius: '9px',
  minWidth: '450px',
});
