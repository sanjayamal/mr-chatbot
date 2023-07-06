import { CAvatar, CCol, CRow, CTypography } from "../../../../components";
import reviewer from "../../../../assets/images/reviewer.png";

const Reviews = () => {
  const comment =
    "This is amazing, It makes business more attractive";
  const name = "John cena";
  const position = "Full-stack Developer";
  return (
    <CRow
      gutter={[8, 8]}
      style={{ marginLeft: 0, marginRight: 0, marginTop: "2rem" }}
    >
      {[1, 2].map(() => (
        <CCol
          className="gutter-row"
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
              <CAvatar src={reviewer} size={"large"} />
            </div>
            <div style={{ textAlign: "center" }}>
              <CTypography.Text type="secondary">{`"${comment}"`}</CTypography.Text>
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
              <CTypography.Text type="secondary">{position}</CTypography.Text>
            </div>
          </div>
        </CCol>
      ))}
    </CRow>
  );
};

export default Reviews;
