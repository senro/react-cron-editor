import LANG from "./i18n";
import React from 'react';

const sixtyArray=[];
const twentyFourArray=[];
const twelveArray=[];
const thirdtyOneArray=[];

for(let i=0;i<60;i++){
    sixtyArray.push(i);
    if(i<24){
        twentyFourArray.push(i);
    }
    if(i<12){
        twelveArray.push(i);
    }
    if(i<31){
        thirdtyOneArray.push(i);
    }
}

const MonthOptions=(lang)=>{
    return [
        <option value="1" key="January">
            {
                LANG[lang]['text.January']
            }
        </option>
        ,
        <option value="2" key="February">
            {
                LANG[lang]['text.February']
            }
        </option>
        ,
        <option value="3" key="March">
            {
                LANG[lang]['text.March']
            }
        </option>
        ,
        <option value="4" key="April">
            {
                LANG[lang]['text.April']
            }
        </option>
        ,
        <option value="5" key="May">
            {
                LANG[lang]['text.May']
            }
        </option>
        ,
        <option value="6" key="June">
            {
                LANG[lang]['text.June']
            }
        </option>
        ,
        <option value="7" key="July">
            {
                LANG[lang]['text.July']
            }
        </option>
        ,
        <option value="8" key="August">
            {
                LANG[lang]['text.August']
            }
        </option>
        ,
        <option value="9" key="September">
            {
                LANG[lang]['text.September']
            }
        </option>
        ,
        <option value="10" key="October">
            {
                LANG[lang]['text.October']
            }
        </option>
        ,
        <option value="11" key="November">
            {
                LANG[lang]['text.November']
            }
        </option>
        ,
        <option value="12" key="December">
            {
                LANG[lang]['text.December']
            }
        </option>
    ]
};
const WeekOptions=(lang)=>{
    return [
        <option value="MON" key="Monday">
            {
                LANG[lang]['text.Monday']
            }
        </option>,
        <option value="TUE" key="Tuesday">
            {
                LANG[lang]['text.Tuesday']
            }
        </option>,
        <option value="WED" key="Wednesday">
            {
                LANG[lang]['text.Wednesday']
            }
        </option>,
        <option value="THU" key="Thursday">
            {
                LANG[lang]['text.Thursday']
            }
        </option>,
        <option value="FRI" key="Friday">
            {
                LANG[lang]['text.Friday']
            }
        </option>,
        <option value="SAT" key="Saturday">
            {
                LANG[lang]['text.Saturday']
            }
        </option>,
        <option value="SUN" key="Sunday">
            {
                LANG[lang]['text.Sunday']
            }
        </option>
    ]
};
const FirstToLastOptions=(lang)=>{
    return [
        <option value="#1" key="First">
            {
                LANG[lang]['text.First']
            }
        </option>,
        <option value="#2" key="Second">
            {
                LANG[lang]['text.Second']
            }
        </option>,
        <option value="#3" key="Third">
            {
                LANG[lang]['text.Third']
            }
        </option>,
        <option value="#4" key="Fourth">
            {
                LANG[lang]['text.Fourth']
            }
        </option>,
        <option value="#5" key="Fifth">
            {
                LANG[lang]['text.Fifth']
            }
        </option>,
        <option value="L" key="last">
            {
                LANG[lang]['text.last']
            }
        </option>
    ]
};
const DayOptions=(lang)=>{
    let baseItems=[
        <option value="1W" key="First Weekday">
            {
                LANG[lang]['text.First_Weekday']
            }
        </option>,
        <option value="LW" key="Last Weekday">
            {
                LANG[lang]['text.Last_Weekday']
            }
        </option>,
        <option value="L" key="Last Day">
            {
                LANG[lang]['text.Last_Day']
            }
        </option>
    ];
    let thridtyOneItems=thirdtyOneArray.map((item,index)=>(
        <option
            value={index+1}
            key={index}
        >
            {
                index+1
            }
            &nbsp;
            {
                index+1==1?'st':''
            }
            {
                index+1==2?'nd':''
            }
            {
                index+1==3?'rd':''
            }
            {
                index+1>=4&&index+1<31?'th':''
            }
            {
                index+1==31?'st':''
            }
            &nbsp;day
        </option>
    ));

    baseItems=baseItems.concat(thridtyOneItems);

    return baseItems;
};
const MonthDayOptions=(lang)=>{
    let result=thirdtyOneArray.map((item,index)=>(
        <option
            value={index+1}
            key={index}
        >
            {
                index+1
            }
        </option>
    ));

    return result;
};
const MonthNumOptions=(lang)=>{
    let result=twelveArray.map((item,index)=>(
        <option
            value={index+1}
            key={index}
        >
            {
                index+1
            }
        </option>
    ));

    return result;
};
const HourOptions=(type)=>{
    let result=[];
    if(type==='1-23'){
        result=twentyFourArray.map((item,index)=>(
            <option
                value={index}
                key={index}
            >
                {
                    index
                }
            </option>
        ));
        result.shift();
    }else{
        result=twentyFourArray.map((item,index)=>(
            <option
                value={index}
                key={index}
            >
                {
                    index
                }
            </option>
        ));
    }

    return result;
};
const MinOrSecondOptions=(type)=>{
    let result=[];

    if(type==="0-60"){
        result=sixtyArray.map((item,index)=>(
            <option
                value={index}
                key={index}
            >
                {
                    index
                }
            </option>
        ));
        result.push(
            <option
                value={60}
                key={60}
            >
                60
            </option>
        )
    }else{
        result=sixtyArray.map((item,index)=>(
            <option
                value={index}
                key={index}
            >
                {
                    index
                }
            </option>
        ));
    }

    return result;
};

exports.MonthOptions=MonthOptions;
exports.WeekOptions=WeekOptions;
exports.FirstToLastOptions=FirstToLastOptions;
exports.DayOptions=DayOptions;
exports.MonthDayOptions=MonthDayOptions;
exports.MonthNumOptions=MonthNumOptions;
exports.HourOptions=HourOptions;
exports.MinOrSecondOptions=MinOrSecondOptions;