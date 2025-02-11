import Header from '../../component/common/Header';
import Footer from '../../component/common/Footer';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Editor } from '@toast-ui/editor';
import { useNavigate } from 'react-router';
import { HTML_EDITOR_MODE } from '../../global/Constants';
import { deleteQuestion, getQuestionDetail } from '../../axios/question/QuestionDetail';
import { convertQuestionStatus } from '../../utils';
import enter from '../../image/icon/arrow-enter.svg';
import {
  EnterImage,
  MoveToListButton,
  QuestionContainer,
  QuestionDetailActionButton,
  QuestionDetailActionDivider,
  QuestionDetailActionWrapper,
  QuestionDetailContentWrapper,
  DetailPageButtonWrapper,
  QuestionDetailSide,
  QuestionDetailSideCreatedAt,
  QuestionDetailSideStatus,
  QuestionDetailTitle,
  QuestionDetailTitleWrapper,
  Viewer,
  QuestionEditorHeader,
  QuestionReplyContentWrapper,
  QuestionReplyEnterWrapper,
  QuestionReplyWrapper,
} from '../../component/question/QuestionComponent';
import { QUESTION, QUESTION_EDITOR } from '../../constants/path';

export default function QuestionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState();

  useEffect(() => {
    let prevData;
    try {
      getQuestionDetail(id).then((res) => {
        prevData = res.data;
        setData(prevData);
        new Editor.factory({
          el: document.querySelector('#viewer'),
          height: '500px',
          initialEditType: 'wysiwyg',
          initialValue: prevData.content,
          language: 'ko-KR',
          viewer: true,
        });
      });
    } catch (err) {
      console.error(err);
    }
    setData(prevData);
  }, []);

  const updateButtonClicked = () => {
    navigate(QUESTION_EDITOR, {
      replace: true,
      state: {
        id,
        mode: HTML_EDITOR_MODE.UPDATE,
      },
    });
  };
  const deleteButtonClicked = () => {
    if (window.confirm('정말로 삭제하시겠습니까?')) {
      deleteQuestion(id)
        .then(() => {
          navigate(QUESTION, {
            replace: true,
          });
        })
        .catch((err) => console.error(err));
    }
  };
  const moveToListButtonClicked = () => {
    navigate(QUESTION, {
      replace: true,
    });
  };
  return (
    <>
      <Header />
      <QuestionContainer>
        <QuestionEditorHeader>1:1문의</QuestionEditorHeader>
        <QuestionDetailContentWrapper>
          {data !== undefined ? (
            <>
              <QuestionDetailTitleWrapper>
                <QuestionDetailTitle>{data.title}</QuestionDetailTitle>
                <QuestionDetailSide>
                  <QuestionDetailSideStatus>
                    {convertQuestionStatus(data.status)}
                  </QuestionDetailSideStatus>
                  <QuestionDetailSideCreatedAt>{data.createdAt}</QuestionDetailSideCreatedAt>
                </QuestionDetailSide>
              </QuestionDetailTitleWrapper>
            </>
          ) : (
            <></>
          )}
          <Viewer id={'viewer'}></Viewer>
          <QuestionDetailActionWrapper>
            <QuestionDetailActionButton onClick={updateButtonClicked}>
              수정
            </QuestionDetailActionButton>
            <QuestionDetailActionDivider>/</QuestionDetailActionDivider>
            <QuestionDetailActionButton onClick={deleteButtonClicked}>
              지우기
            </QuestionDetailActionButton>
          </QuestionDetailActionWrapper>
        </QuestionDetailContentWrapper>

        {data?.questionReplyResponse !== null ? (
          <QuestionReplyWrapper>
            <QuestionReplyEnterWrapper>
              <EnterImage src={enter} />
            </QuestionReplyEnterWrapper>
            <QuestionReplyContentWrapper>
              {data?.questionReplyResponse.replyContent}
            </QuestionReplyContentWrapper>
          </QuestionReplyWrapper>
        ) : (
          ''
        )}
        <DetailPageButtonWrapper>
          <MoveToListButton onClick={moveToListButtonClicked}>뒤로가기</MoveToListButton>
        </DetailPageButtonWrapper>
      </QuestionContainer>
      <Footer />
    </>
  );
}
