import React from "react";
import { AppBar, Toolbar, Button, Grid, Typography } from "@mui/material";
import theme from "@/defaults/crude-theme";
import labels from "@/defaults/crude-labels";

interface NavLinkProps {
  type: "default" | "featured";
  label: string;
  url: string;
}

const NavLink: React.FC<NavLinkProps> = (props: NavLinkProps) => {
  const color =
    props.type === "featured" ? theme.text.secondary : theme.text.default;
  return (
    <Typography color={color} fontSize={"12px"}>
      <a href={props.url}> {props.label} </a>
    </Typography>
  );
};

const Navbar: React.FC = () => {
  return (
    <AppBar
      position="fixed"
      style={{
        minHeight: "72px",
        backgroundColor: theme.navbar.primary,
      }}
    >
      <Toolbar>
        <img
          src="cb-logo.svg"
          alt="CurrencyBirdLogo"
          style={{ marginRight: "6vw", width: "150px" }}
        />
        <Grid container style={{ gap: "2vw" }}>
          <NavLink
            type="featured"
            label={labels.navbar.links.featured}
            url="/#"
          />
          <NavLink type="default" label={labels.navbar.links.first} url="/#" />
          <NavLink type="default" label={labels.navbar.links.second} url="/#" />
          <NavLink type="default" label={labels.navbar.links.third} url="/#" />
          <NavLink type="default" label={labels.navbar.links.fourth} url="/#" />
          <NavLink type="default" label={labels.navbar.links.fifth} url="/#" />
          <NavLink type="default" label={labels.navbar.links.sixth} url="/#" />
        </Grid>
        <Button
          variant="contained"
          style={{ backgroundColor: theme.text.secondary }}
        >
          <Typography color={theme.text.primary}>Ingresar</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
