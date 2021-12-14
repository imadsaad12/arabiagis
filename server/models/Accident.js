const mongoose=require("mongoose")

const schema=new mongoose.Schema({
    'Accident_Index': String,
    Location_Easting_OSGR: String,
    Location_Northing_OSGR: String,
    Longitude: String,
    Latitude: String,
    Police_Force:String,
    Accident_Severity:String,
    Number_of_Vehicles:String,
    Number_of_Casualties:String,
    Date: String,
    Day_of_Week:String,
    Time:String,
    'Local_Authority_(District)':String,
    'Local_Authority_(Highway)':String,
    '1st_Road_Class': String,
    '1st_Road_Number':String,
    Road_Type:String,
    Speed_limit:String,
    Junction_Detail: String,
    Junction_Control: String,
    '2nd_Road_Class':String,
    '2nd_Road_Number':String,
    'Pedestrian_Crossing-Human_Control':String,
    'Pedestrian_Crossing-Physical_Facilities':String,
    Light_Conditions: String,
    Weather_Conditions:String,
    Road_Surface_Conditions:String,
    Special_Conditions_at_Site: String,
    Carriageway_Hazards: String,
    Urban_or_Rural_Area:String,
    Did_Police_Officer_Attend_Scene_of_Accident:String,
    LSOA_of_Accident_Location: String

})
const Accident=mongoose.model("Accidents",schema)
module.exports=Accident