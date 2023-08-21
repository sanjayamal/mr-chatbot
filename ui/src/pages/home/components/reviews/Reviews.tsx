import {
  CAvatar,
  CCol,
  CRate,
  CRow,
  CTypography,
  CCarousel,
  CButton,
} from "../../../../components";
import { useEffect, useState } from "react";
import "./Reviews.scss";
import { AddReview } from "./components";
import { IReview } from "../../../../interfaces";
import { useAppDispatch, useAuth } from "../../../../hooks";
import { getReviews } from "../../../../store/chatbot";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Array<IReview>>([]);
  const auth = useAuth();
  const { isAuthenticated } = auth;

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getReviews())
      .then((response) => {
        setReviews(response.payload);
      })
      .catch(() => {
        setReviews([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const showModal = () => {
    if (isAuthenticated) {
      setIsModalOpen(true);
    } else {
      navigate("/login");
    }
  };

  const handleModal = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
  };

  // Split the carouselData into chunks of 2 for each frame
  const getReviewsChunks = (reviews: Array<IReview>): Array<Array<IReview>> => {
    try {
      const chunks: Array<Array<IReview>> = [];
      for (let i = 0; i < reviews.length; i += 2) {
        chunks.push(reviews.slice(i, i + 2));
      }
      return chunks;
    } catch (error) {
      return [];
    }
  };

  function getRandomNumberInclusive() {
    return Math.ceil(Math.random() * 10); // Generates a random integer from 1 to 10 (inclusive)
  }

  return (
    <>
      <CRow>
        <CCol
          flex={1}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginRight: "8rem",
          }}
        >
          <CButton onClick={showModal}>Add Review</CButton>
        </CCol>
      </CRow>
      <CRow className="margin-top-1rem margin-bottom-1rem">
        <CCol xs={{ span: 22, offset: 1 }} md={{ span: 16, offset: 4 }}>
          <CCarousel autoplay autoplaySpeed={4500} effect="fade">
            {getReviewsChunks(reviews).map((review, index) => (
              <div key={index}>
                <CRow gutter={[8, 8]} style={{ marginLeft: 0, marginRight: 0 }}>
                  {review.map(({ name, content, rate }, index) => (
                    <CCol
                      className="gutter-row"
                      key={index}
                      xs={{ span: 16, offset: 4 }}
                      sm={{ span: 10, offset: 1 }}
                      md={{ span: 8, offset: 3 }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <CAvatar
                            src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${getRandomNumberInclusive()}`}
                            size={"large"}
                          />
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <CTypography.Text type="secondary">
                            {content}
                          </CTypography.Text>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                          }}
                        >
                          <CTypography.Text>{name}</CTypography.Text>
                          <CRate
                            allowHalf
                            defaultValue={3}
                            value={rate}
                            disabled
                          />
                        </div>
                      </div>
                    </CCol>
                  ))}
                </CRow>
              </div>
            ))}
          </CCarousel>
        </CCol>
      </CRow>
      <AddReview isOpen={isModalOpen} handleModal={handleModal} />
    </>
  );
};

export default Reviews;
