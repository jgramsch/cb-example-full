import labels from "@/defaults/crude-labels";
import theme from "@/defaults/crude-theme";
import { Box, Typography, Link } from "@mui/material";

const Header: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      height="100%"
      p={{ xs: 2, md: 4 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        maxWidth="50%"
        gap={2}
      >
        <Typography variant="h2" color={theme.text.primary}>
          {labels.header.title}
        </Typography>
        <Typography variant="body1" color={theme.text.primary}>
          {labels.header.paragraph}
        </Typography>
        <Link
          href="#how-it-works"
          color={theme.text.secondary}
          fontWeight="bold"
          fontSize="20px"
          underline="hover"
        >
          {labels.header.link}
        </Link>
      </Box>
      <Box>
        <img src="headerbird.webp" />
      </Box>
    </Box>
  );
};

export default Header;
