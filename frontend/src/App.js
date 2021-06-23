import DateFnsUtils from '@date-io/date-fns';
import { AppBar, Card, CardContent, Grid, IconButton, Snackbar, Tab, Tabs } from '@material-ui/core';
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


export const myAxios = axios.create({
  timeout: 4000,
  // backend IP
  baseURL: (window.env?.API_URL) || "http://localhost:8080/https://data.korona.gov.sk/api"
});


// import { corData } from '../data/out';
// import { useInterval } from '../utils';
// import {rizikoData} from '../data/riziko_out'

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  map: {
    marginTop: 25,
    width: "60%",
    // height: 800
  },
  card: {
    backgroundColor: theme.palette.background.default
  }
}));

function App() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(moment().subtract(1, "days"));
  const [data, setData] = useState({});
  const [dataAvailability, setDataAvailability] = useState(true);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [colorPair, setColorPair] = useState(['#430500', '#FFDFDF'])
  const [legendInterval, setLegendInterval] = useState([9, 10])

  const handleDateChange = (date) => {
    setSelectedDate(moment(date));
  };

  const getData = (url, primary, secondary) => {

    let apiDate = moment(selectedDate).format('YYMMDD').toString()
    let conf = {
      method: "get",
      url: url,
      params: {
        offset: apiDate + '0080',
      },
      headers: { "Access-Control-Allow-Origin": "*" }
    }
    myAxios(conf)
      .then(res => {
        let result = res.data.page.filter(item => (item.published_on === moment(selectedDate).format('YYYY-MM-DD').toString()))
          .reduce((acc, item, index) => {

            let second = Object.keys(secondary).reduce((acc, key, index) => {
              acc[secondary[key]] = item[key]
              return acc;
            }, {})

            acc[item.district_id] = { primary: item[primary], secondary: second }
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





  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  useEffect(() => {
    switch (tabIndex) {
      case 0:
        setColorPair(['#FFFFFF', '#FF0000']);
        setLegendInterval([1, 10]);
        getData(
          "/ag-tests/by-district",
          'positivity_rate',
          {
            positives_count: "Number of positive tests",
            negatives_count: "Number of negative tests",
            positives_sum: "Sum of positive tests",
            negatives_sum: "Sum of negative tests"
          }
        );
        break;
      case 1:
        setColorPair(['#FF0000', '#FFFFFF']);
        setLegendInterval([100, 6]);
        getData(
          "/hospital-beds/by-district",
          'free_all',
          {
            "capacity_all": "Total capacity",
            "capacity_covid": "Covid capicity",
            "occupied_jis_covid": "JIS occupied",
            "occupied_oaim_covid": "OAIM occupied",
            "occupied_o2_covid": "Oxygen occupied",
            "occupied_other_covid": "Other",
          }
        );
        break;
      case 2:
        setColorPair(['#FF0000', '#FFFFFF']);
        setLegendInterval([1, 9]);
        getData(
          "/hospital-patients/by-district",
          'confirmed_covid',
          {
            "ventilated_covid": "Number of ventilated patients",
            "non_covid": "Number of non-covid patients",
            "suspected_covid": "Number of suspected covid patients",
          }
        );
        break;
      default:
      // code block
    }

  }, [selectedDate, tabIndex])

  useEffect(() => {
    setColorPair(['#FFFFFF', '#FF0000']);
    setLegendInterval([100, 10]);
    getData(
      "/ag-tests/by-district",
      'positivity_rate',
      {
        positives_count: "Number of positive tests",
        negatives_count: "Number of negative tests",
        positives_sum: "Sum of positive tests",
        negatives_sum: "Sum of negative tests"
      }
    );
    // eslint-disable-next-line
  }, [])

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

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

        <AppBar position="static" color="default">
          <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example" centered>
            <Tab label="Ag tests" {...a11yProps(0)} />
            <Tab label="Hospital beds" {...a11yProps(1)} />
            <Tab label="Patients in hospital" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <Box display="flex" justifyContent="center">
          <div className={classes.map}>
            <Map
              data={data}
              handleSelect={(target) => {
                // setRegion(target)
              }}
              legendInterval={legendInterval}
              colorPair={colorPair}
            />
          </div>

        </Box>

        <Box position="fixed" bottom="0" width="100%" display="flex" justifyContent="center" >
          <Card className={classes.card} >
            <CardContent>
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
