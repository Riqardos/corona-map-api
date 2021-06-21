import DateFnsUtils from '@date-io/date-fns';
import { Card, CardContent, Grid, IconButton, Snackbar, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MuiAlert from '@material-ui/lab/Alert';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import axios from 'axios';
import 'date-fns';
import moment from 'moment';
import { default as React, useEffect, useState } from 'react';
import './App.css';
import { Map } from './SvkMap';





// import { corData } from '../data/out';
// import { useInterval } from '../utils';
// import {rizikoData} from '../data/riziko_out'

const useStyles = makeStyles((theme) => ({
  root: {
    // height: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  map: {
    // marginTop: 50,
    width: "60%",
    // height: 800
  }
}));

function App() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(moment().subtract(1, "days"));
  const [region, setRegion] = useState({ id: undefined, name: "Not selected", value: "No data" })
  const [data, setData] = useState({});
  const [dataType, setDataType] = useState("");
  const [dataAvailability, setDataAvailability] = useState(true);



  const handleDateChange = (date) => {
    setSelectedDate(moment(date));
    getAgTestByDate(date)
  };

  const getAgTestByDate = (date) => {
    let apiDate = moment(date).format('YYMMDD').toString()
    setDataType('Ag test positivity rate')

    let conf = {
      method: "get",
      // url: "https://cors-anywhere.herokuapp.com/https://data.korona.gov.sk/api/ag-tests/by-district",
      url: "https://data.korona.gov.sk/api/ag-tests/by-district",
      params: {
        offset: apiDate + '0080',
      },
      headers: { "Access-Control-Allow-Origin": "*" }
    }

    axios(conf)
      .then(res => {
        let result = res.data.page.filter(item => (item.published_on === moment(date).format('YYYY-MM-DD').toString()))
          .reduce((acc, item, index) => {
            acc[item.district_id] = item.positivity_rate
            return acc
          }, {})
        setData(result);
        setDataAvailability(true);
        if (Object.keys(result).length === 0) {
          setDataAvailability(false);
        }

      })
      .catch(err => {
        console.log(err);
        setDataAvailability(false);

      })


  }


  useEffect(() => {
    getAgTestByDate(selectedDate);
    // eslint-disable-next-line
  }, [])


  return (
    <>
      <Box className={classes.root}>

        {/* <Typography align="center" variant="h2" color="textPrimary">COVID-19</Typography>

        <Typography
          color="textPrimary"
          align="center"
          variant="h3"
        >
          Title
          </Typography> */}


        <Box display="flex" justifyContent="center">
          <div className={classes.map}>
            <Map
              data={data}
              dataType={dataType}
              handleSelect={(target) => {
                setRegion(target)
              }}
              colorPair={['#430500', '#FFDFDF']}
            />
          </div>

        </Box>
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
                  <Box width={200}>
                    <KeyboardDatePicker
                      // style={{ width: "150px", marginBottom: "20px" }}
                      disableToolbar
                      variant="inline"
                      format="dd.MM.yyyy"
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
                  </Box>

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



      </Box>
      <Snackbar open={!dataAvailability} autoHideDuration={6000} onClose={() => setDataAvailability(true)}>
        <MuiAlert elevation={6} variant="filled" onClose={() => setDataAvailability(true)} severity="warning">
          Missing data!
                </MuiAlert>
      </Snackbar>
    </>
  );
}

export default App;
