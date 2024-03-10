import { CardContent } from "@material-ui/core";

function Card({ note, date, color }) {
  return (
    <CardContent
      style={{
        float: "left",
        minWidth: 300,
        maxWidth: 300,
        minHeight: 200,
        backgroundColor: color,
        borderRadius: "2.5%",
        marginRight: "10px",
        marginTop: "10px",
      }}
    >
      <p style={{ fontSize: 12 }}>{date}</p>
      <br />
      <p>{note}</p>
      {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
          adjective
        </Typography> */}
      {/* <Typography variant="body2">
        well meaning and kindly.
        <br />
        {'"a benevolent smile"'}
      </Typography> */}
    </CardContent>
  );
}

export default Card;
