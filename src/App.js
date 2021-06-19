import DateFnsUtils from '@date-io/date-fns';
import { Card, CardContent, Grid, IconButton, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import 'date-fns';
import moment from 'moment';
import { default as React, useState } from 'react';
import './App.css';
import { Map } from './SvkMap';




// import { corData } from '../data/out';
// import { useInterval } from '../utils';
// import {rizikoData} from '../data/riziko_out'

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  map: {
    marginTop: 50,
    width: "90%",
    height: 800
  }

}));

function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [regionDateInterval, setRegionDateInterval] = useState([])
  const [selectedDate, setSelectedDate] = React.useState(moment('12/4/2020'));
  const [region, setRegion] = useState({ id: undefined, name: "Not selected", value: "No data" })


  const handleDateChange = (date) => {
    setSelectedDate(moment(date));
  };


  // useEffect(() => {
  //   console.log(
  //     districts.reduce((acc, item, index) => {
  //       acc[`district${item.id}`] = item
  //       return acc
  //     }, {}))
  // }, [])

  console.log(theme.palette.background.paper)

  return (
    <>
      <div className={classes.root}>

        <Typography align="center" variant="h2" color="textPrimary">COVID-19 </Typography>

        <Typography
          color="textPrimary"
          align="center"
          variant="h3"
        >
          Title
          </Typography>

        <Box display="flex" justifyContent="center">
          <div className={classes.map}>

            <Map
              // data={rizikoData} sem pojdu data 
              handleSelect={(target) => {
                setRegion(target)
                console.log(target)
              }}
              colorPair={['#430500', '#FFDFDF']}
            />
          </div>

        </Box>
        {/* <Grid item lg={4} sm={12} > */}
        <Box display="flex" justifyContent="center">
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h4" align="center" >{(region && region.name)}</Typography>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="center"
                // spacing={10}
                >

                  <IconButton
                    onClick={() => {
                      handleDateChange(moment(selectedDate).subtract(1, 'days'));
                    }}>
                    <KeyboardArrowLeftIcon style={{ fontSize: 30 }} />

                  </IconButton>
                  <KeyboardDatePicker
                    style={{ width: "150px", marginBottom: "20px" }}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date"
                    value={moment(selectedDate).format('L')}
                    onChange={(date) =>
                      handleDateChange(new Date(date))}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      handleDateChange(moment(selectedDate).add(1, 'days'));
                    }}>
                    <KeyboardArrowRightIcon style={{ fontSize: 30 }} />

                  </IconButton>

                </Grid>
              </MuiPickersUtilsProvider>
              {/* <Typography align="left"  >
                {region.name}</Typography> */}
              {/* <LineChart regionDateInterval={regionDateInterval}
                  region={region}
                  selectedDate={selectedDate} /> */}
            </CardContent>
          </Card>
        </Box>
        {/* </Grid> */}



      </div>

    </>
  );
}

export default App;
