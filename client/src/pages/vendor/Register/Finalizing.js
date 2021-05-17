import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles((theme) => ({
  iconMargin: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
}));

export default function Finalizing() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Terms and Condition
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="error">
            By accepting the terms and condition, you certify that I would NOT
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            <CheckIcon
              fontSize="small"
              color="error"
              className={classes.iconMargin}
            />
            Use the support services improperly, or submit false reports of
            abuse or misconduct.
          </Typography>
          <Typography variant="subtitle1">
            <CheckIcon
              fontSize="small"
              color="error"
              className={classes.iconMargin}
            />
            Harass, abuse, or harm another person using any information obtained
            from your site.
          </Typography>
          <Typography variant="subtitle1">
            <CheckIcon
              fontSize="small"
              color="error"
              className={classes.iconMargin}
            />
            Use scripts, data-mining, robots, or similar data gathering tools to
            send comments or messages.
          </Typography>
          <Typography variant="subtitle1">
            <CheckIcon
              fontSize="small"
              color="error"
              className={classes.iconMargin}
            />
            Sell or otherwise transfer their profile.
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
