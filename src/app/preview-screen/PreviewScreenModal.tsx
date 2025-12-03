import { FC, useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import Image from 'next/image';

import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import {
  DocxContainer,
  LoaderWrapper,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
  PreviewLoader,
} from './styles';
import { PreviewScreenRow } from './types';

interface PreviewScreenModalProps {
  noticePreviewDoc?: Blob | null;
  closeModal: () => void;
  selectedRow: PreviewScreenRow | null;
  testId?: string;
}

const CloseIcon = () => (
  <Image src="icons/cross.svg" width={10} height={10} alt="modal-close-icon" />
);

// This matches the typical DOCX page height
const DOCX_PAGE_HEIGHT = 1123;

const hasParagraphContent = (paragraph: HTMLElement): boolean => {
  const textContent = paragraph.textContent?.trim() || '';
  const hasImages = paragraph.querySelector('img');
  const hasOtherContent = paragraph.querySelector('table, ul, ol, svg, canvas');
  return !!(textContent || hasImages || hasOtherContent);
};

// Remove empty <p> tags only within article tags, but ensure spacing before last content paragraph
const removeEmptyElements = (container: HTMLElement): void => {
  const articles = Array.from(container.querySelectorAll('article')) as HTMLElement[];

  articles.forEach((article) => {
    const paragraphs = Array.from(article.querySelectorAll('p')) as HTMLElement[];
    if (paragraphs.length === 0) return;

    let lastContentIndex = -1;
    for (let i = paragraphs.length - 1; i >= 0; i--) {
      if (hasParagraphContent(paragraphs[i])) {
        lastContentIndex = i;
        break;
      }
    }

    // If no content paragraph found, skip processing
    if (lastContentIndex === -1 || lastContentIndex === 0) return;

    // Check if there's an empty paragraph right before the last content paragraph
    const emptyBeforeLast =
      lastContentIndex > 0 && !hasParagraphContent(paragraphs[lastContentIndex - 1]);

    for (let i = paragraphs.length - 1; i >= 1; i--) {
      const paragraph = paragraphs[i];
      const isEmpty = !hasParagraphContent(paragraph);

      // Remove if paragraph is completely empty
      if (isEmpty) {
        // If this empty paragraph is right before the last content paragraph, keep it for spacing
        if (i === lastContentIndex - 1 && emptyBeforeLast) {
          continue; // Keep this empty paragraph
        }
        paragraph.remove();
      }
    }
  });
};

const PreviewScreenModal: FC<PreviewScreenModalProps> = ({
  noticePreviewDoc,
  closeModal,
  selectedRow,
  testId = 'preview-screen-modal',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const docxContentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const adjustDocumentHeight = () => {
    setTimeout(() => {
      if (docxContentRef.current) {
        const wrapper = docxContentRef.current.querySelector('.docx-preview-wrapper');
        if (wrapper) {
          removeEmptyElements(wrapper as HTMLElement);

          const sections = Array.from(
            wrapper.querySelectorAll('section.docx-preview'),
          ) as HTMLElement[];

          if (sections.length > 0) {
            // For each section, add margin between article and footer if needed
            sections.forEach((section) => {
              const article = section.querySelector('article') as HTMLElement;
              const footer = section.querySelector('footer') as HTMLElement;

              if (article && footer) {
                const currentHeight = section.offsetHeight;
                const heightDiff = DOCX_PAGE_HEIGHT - currentHeight;

                // Add margin to footer to fill the gap
                if (heightDiff > 0) {
                  const currentMarginTop = parseFloat(getComputedStyle(footer).marginTop) || 0;
                  footer.style.marginTop = `${currentMarginTop + heightDiff}px`;
                }
              }
            });
          }
        }
      }
    }, 0);
  };

  useEffect(() => {
    if (!docxContentRef.current) return;
    if (!noticePreviewDoc) {
      setIsLoading(true);
      return;
    }
    setIsLoading(true);
    // Clear previous content
    if (docxContentRef.current) {
      docxContentRef.current.innerHTML = '';
    }

    void renderAsync(noticePreviewDoc, docxContentRef.current, undefined, {
      className: 'docx-preview',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: true,
      useBase64URL: true,
      breakPages: true,
      renderHeaders: true,
      renderFooters: true,
      // rely on document-provided page breaks; do not override
    })
      .then(adjustDocumentHeight)
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, [noticePreviewDoc]);

  useExternalElementClick(modalRef, () => {
    if (selectedRow !== null) {
      closeModal();
    }
  }, [selectedRow !== null]);

  return (
    <ModalWrapper>
      <ModalContainer ref={modalRef}>
        <ModalHeader>
          <ModalTitle data-testid={prepareDataTestId('title', testId)}>Notice Preview</ModalTitle>
          <ModalCloseButton onClick={closeModal}>
            <CloseIcon />
          </ModalCloseButton>
        </ModalHeader>
        <ModalContent>
          <DocxContainer data-testid={prepareDataTestId('notice-preview', testId)}>
            {isLoading && (
              <LoaderWrapper data-testid={prepareDataTestId('loader', testId)}>
                <PreviewLoader />
              </LoaderWrapper>
            )}
            <div ref={docxContentRef} data-testid={prepareDataTestId('docx', testId)} />
          </DocxContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWrapper>
  );
};

export default PreviewScreenModal;
