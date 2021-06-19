import { Box, Card, CardContent, ClickAwayListener, Divider, Fade, Grid, Popper, Slider, Snackbar, Typography, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import chroma from "chroma-js";
import 'date-fns';
import { ColorPicker } from 'material-ui-color';
import { default as React, useEffect, useState } from 'react';
import { districts as okresy } from './dataDistricts';
// import { corData } from '../data/out';
import { map } from './map';


// const okresy_pocet_obyv = { "0": "36,184", "1": "110,716", "2": "16,069", "3": "77,765", "4": "437,726", "5": "61,269", "6": "30,965", "7": "89,952", "8": "31,967", "9": "39,417", "10": "122,825", "11": "94,147", "12": "31,894", "13": "44,943", "14": "61,773", "15": "59,075", "16": "75,533", "17": "101,500", "18": "238,593", "19": "130,132", "20": "22,139", "21": "32,890", "22": "110,523", "23": "33,708", "24": "72,216", "25": "73,342", "26": "74,661", "27": "96,171", "28": "11,787", "29": "110,748", "30": "26,256", "31": "62,879", "32": "161,679", "33": "62,575", "34": "138,577", "35": "45,489", "36": "65,593", "37": "62,726", "38": "21,397", "39": "104,990", "40": "62,351", "41": "176,181", "42": "133,721", "43": "44,248", "44": "39,537", "45": "84,048", "46": "62,131", "47": "56,657", "48": "60,659", "49": "91,612", "50": "60,419", "51": "47,078", "52": "36,123", "53": "22,789", "54": "99,878", "55": "53,958", "56": "20,442", "57": "32,484", "58": "51,568", "59": "69,947", "60": "105,295", "61": "114,670", "62": "132,779", "63": "15,880", "64": "36,203", "65": "43,263", "66": "80,841", "67": "40,512", "68": "68,685", "69": "26,112", "70": "46,732", "71": "158,279" }

const useStyles = makeStyles((theme) => ({
    path: {
        transition: "fill 0.3s ease-in-out 0.3s",
        cursor: "pointer",
        stroke: theme.palette.text.primary,
        // stroke: "black",
        "&:hover": {
            strokeWidth: "1px",
            stroke: theme.palette.text.primary
        }

    },
    root: {
        // position: "relative",
    },
    tooltip: {
        position: "absolute",
        boxShadow: "0 8px 16px 0 rgba(0,0,0,1)",
        zIndex: 2000
    }

}));

// const HtmlTooltip = withStyles((theme) => ({
//     tooltip: {
//         backgroundColor: 'rgba(255, 255, 255, 0.5)',
//         color: 'rgba(0, 0, 0, 0.87)',
//         maxWidth: 220,
//         fontSize: theme.typography.pxToRem(8),
//     },
// }))(Tooltip);


export function Map({ data, handleSelect, handleNoData, ...props }) {

    const classes = useStyles();
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.up('lg'));
    const defaultColor = chroma("white");
    const [legendInterval, setLegendInterval] = useState(10);
    const [legendBuckets, setLegendBuckets] = useState(9);
    const [colorPair, setColorPair] = useState(props.colorPair || ['#FFDFDF', "#430500"]);
    const [colorPalette, setColorPalette] = useState(chroma.scale([colorPair[0], colorPair[1]]).mode('hsl').colors(legendBuckets).map((item, index) => ({ color: item, limit: index * legendInterval })).reverse());
    const [regions, setRegions] = useState(map.svg.g.path.map((item, index) => ({ id: item["-id"].replace('okres', ""), name: item["-id"], d: item["-d"], selected: false, color: defaultColor })))
    const [districtName, setDistrictName] = useState(false);
    const [dataAvailability, setDataAvailability] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ x: undefined, y: undefined });
    const [selected, setSelected] = useState(false);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open);
    };


    useEffect(() => {
        setColorPalette(chroma.scale([colorPair[0], colorPair[1]]).mode('hsl').colors(legendBuckets).map((item, index) => ({ color: item, limit: index * legendInterval })).reverse())
    }, [])

    function handleMapSelect(id) {
        setRegions(regions.map((item) => ({ ...item, selected: (item.id === id ? !item.selected : false) })))

    }

    function handleColorPalette(n_colors, interval, colorPair) {
        setColorPalette(chroma.scale([colorPair[0], colorPair[1]]).mode('hsl').colors(n_colors).map((item, index) => ({ color: item, limit: index * interval })).reverse())
    }

    useEffect(() => {
        handleColorPalette(legendBuckets, legendInterval, colorPair)
    }, [legendBuckets, legendInterval, colorPair])

    useEffect(() => {
        let select = regions.find(item => item.selected)
        setSelected(select)
        if (select) {
            let id = select.id
            handleSelect({ id, name: okresy[id].title, value: (data ? data[id] : "Missing"), selected: select })
        }
        else {
            handleSelect(select)
        }
    }, [regions])

    useEffect(() => {
        if (data) {
            setRegions(regions.map((item, id) => {
                const regionValue = (parseInt(data[item.id]));
                return {
                    ...item,
                    color: (regionValue == -1) ? theme.palette.background.paper : colorPalette.find((col) => col.limit <= regionValue).color
                }
            }))
            let region = regions.find(region => region.selected)
            if (region) {
                handleSelect({ ...region, value: data[region.id], name: okresy[region.id].title })
            }
        }
        else {
            setDataAvailability(false)
            setRegions(regions.map((item, id) => ({ ...item, color: theme.palette.background.paper })))
        }
    }, [colorPalette, data])


    return (
        <>
            {/* {console.log("render")} */}
            <div className={classes.root} >
                {position.x &&
                    <Card className={classes.tooltip}
                        style={{
                            left: position.x + 20,
                            top: position.y - 80
                        }}>
                        <CardContent>
                            <Typography
                            >{position.region.title}
                            </Typography>
                        </CardContent>
                    </Card>
                }

                <svg
                    width="100%"
                    viewBox="0 0 290.36 144.18"
                    onMouseLeave={e => {
                        setPosition({ x: undefined, y: undefined, region: undefined, value: undefined })
                    }}
                >
                    <g>
                        {
                            regions.map((path, index) =>

                                <path key={`path${index}`} d={path.d}
                                    fill={selected ? (path.selected ? path.color : chroma(path.color).darken(2)) : path.color}
                                    // fill={path.selected ? path.color : chroma(path.color).darken(2) }
                                    className={classes.path}
                                    strokeWidth={path.selected ? "2px" : "0.5px"}
                                    onClick={(event) => {
                                        handleMapSelect(path.id)
                                    }}
                                    onMouseMoveCapture={e => {
                                        e.persist()
                                        setPosition({
                                            x: e.clientX,
                                            y: e.clientY,
                                            region: okresy[path.id],
                                            // value: data[path.id] 
                                        })
                                    }}
                                >
                                </path>
                            )
                        }
                    </g>
                </svg>
                <Grid
                    style={{
                        cursor: "pointer",
                        marginTop: (!matches ? "0px" : "-70px")
                    }}
                    container
                    direction="row"
                    justify={(!matches ? "center" : "flex-end")}
                    // justify="center"
                    onClick={handleClick}
                    spacing={1}
                >
                    {colorPalette.slice(0).reverse().map((item, id) => (
                        <Grid key={`grid${id}`} item
                            style={{
                                textAlign: "left",
                            }}
                        >
                            <Box style={{ width: "20px", height: "20px", backgroundColor: item.color }} />
                            <Typography color="textPrimary" style={{ fontSize: "12px" }}>{`${item.limit}`}</Typography>
                        </Grid>

                    ))}
                </Grid>
                <Popper open={open} anchorEl={anchorEl} placement={(!matches ? "top" : "top-end")} transition>
                    {({ TransitionProps }) => (
                        <ClickAwayListener onClickAway={() => setOpen(false)}>
                            <Fade {...TransitionProps} timeout={350}>
                                <Card >
                                    <Typography style={{
                                        padding: "20px 50px"
                                    }} variant="h5">Legend settings</Typography>
                                    <Divider />
                                    <CardContent style={{
                                        padding: "20px 50px"
                                    }}>
                                        <Typography>Buckets</Typography>
                                        <Slider
                                            aria-labelledby="Buckets"
                                            valueLabelDisplay="auto"
                                            value={legendBuckets}
                                            step={1}
                                            marks
                                            min={2}
                                            max={10}
                                            onChange={(event, newValue) => { setLegendBuckets(newValue) }}
                                        />
                                        <Typography>Interval</Typography>
                                        <Slider

                                            // getAriaValueText={valuetext}
                                            aria-labelledby="Interval"
                                            valueLabelDisplay="auto"
                                            value={legendInterval}
                                            step={10}
                                            marks
                                            min={10}
                                            max={100}
                                            onChange={(event, newValue) => { setLegendInterval(newValue) }}
                                        />
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="center"
                                        >
                                            <Grid item>
                                                <ColorPicker value={colorPair[0]} hideTextfield onChange={color => setColorPair([`#${color.hex}`, colorPair[1]])} />

                                            </Grid>
                                            <Grid item>
                                                <ColorPicker value={colorPair[1]} hideTextfield onChange={color => setColorPair([colorPair[0], `#${color.hex}`])} />

                                            </Grid>


                                        </Grid>
                                        <Grid
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="center"
                                        // spacing={1}
                                        >
                                            {/* <Grid item>

                                                <Typography>Show districts</Typography>

                                            </Grid>
                                            <Grid item>

                                                <Switch
                                                    checked={districtName}
                                                    onChange={(event) => setDistrictName(event.target.checked)}
                                                    name="Show districts"
                                                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                                                />
                                            </Grid> */}

                                        </Grid>

                                    </CardContent>
                                </Card>
                            </Fade>
                        </ClickAwayListener>

                    )}
                </Popper>

                <Snackbar open={!dataAvailability} autoHideDuration={6000} onClose={() => setDataAvailability(true)}>
                    <MuiAlert elevation={6} variant="filled" onClose={() => setDataAvailability(true)} severity="warning">
                        Missing data!
                </MuiAlert>
                </Snackbar>
            </div>
        </>
    )

}