## import dependencies
from flask import Flask, render_template, jsonify

#from flask_sqlalchemy import SQLAlchemy 
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, column
import os
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
#---------------------------------------

# Flask App Setup 

app = Flask(__name__)

#create an engine object
engine = create_engine("sqlite:///bellybutton.sqlite") 

## Database setup 
Base = automap_base()


#reflect the tables in the database 
Base.prepare(engine, reflect=True)


# map the tables 
Samples = Base.classes.samples
Samples_metadata = Base.classes.sample_metadata




# -------------------------------------------
# Below is script of a function to get values, labels for creating pie chart
def pieData(sample):

    #query the mapped table with desired sample, sort the column in descending order to display the top 10 otu_id count
    top_10_samples_values = engine.execute(f"SELECT otu_id, otu_label, \"{sample}\" FROM samples ORDER BY \"{sample}\" DESC LIMIT 10;")

    # -------------------------------------------
    # Below is script to get the pie chart trace

    #create arrays for value, label, and hovertext arrays to create pie chart
    pie_value = []
    pie_label = []
    pie_hovertext = []
    pie_dict = {}

    #loop through query and to create dictionary of values for 
    for x, y, z in top_10_samples_values:
        pie_value.append(z)
        pie_hovertext.append(y)
        pie_label.append(x)

    pie_dict = {"values": pie_value, "labels": pie_label, "hoverinfo": pie_hovertext}

    return pie_dict

    
    
    
# -------------------------------------------
# below is the script of a function to get the bubble chart trace and layout
def bubbleData(sample):
    #query to get the trace for bubblechart
    bubble_query = engine.execute(f"SELECT otu_id, otu_label, \"{sample}\" FROM samples;")

    # create lists
    bubble_Xvalue = []
    bubble_Yvalue = []
    bubble_MarkerSize = []
    bubble_MarkerColor = []
    bubble_textValues = []

    bubble_dict = {}

    for ID, label, value in bubble_query:
        bubble_Xvalue.append(ID)
        bubble_Yvalue.append(value)
        bubble_MarkerSize.append(value)
        bubble_MarkerColor.append(ID)
        bubble_textValues.append(label)

    bubble_dict= {"x": bubble_Xvalue, "y": bubble_Yvalue, "text": bubble_textValues, "color": bubble_MarkerColor, "size": bubble_MarkerSize}

    #bubble_dict= {"x": bubble_Xvalue, "y": bubble_Yvalue, "text": bubble_textValues, "marker": {"color": bubble_MarkerColor, "size": bubble_MarkerSize}}


    return bubble_dict




#-------------------------------------
# flask app routes 

@app.route("/")
def index():

    # create dataframe from query
    df = pd.read_sql("SELECT * FROM samples", engine)
    #manipulate queries dataframe
    belly_button_samples = df.T.iloc[2:].index.values.tolist()


    #render index.html with belly button samples to create and append option tags for dropdown menu
    return render_template("index.html", belly_button_samples=belly_button_samples)


#route for retrieving sample data 
@app.route("/samples/<sample>")
def samples(sample):
    data = []
    pie_sample = pieData(sample)
    bubble_sample = bubbleData(sample)
    
    data.append(pie_sample)
    data.append(bubble_sample)
    # return javascript object to be used for plotting in app.js file 
    return jsonify(data)


#route to retrieve metadata for sample
@app.route("/metadata/<sample>")
def metadata(sample):
    #query table for metadata for a sample
    metadata_query = engine.execute(f"SELECT * FROM sample_metadata WHERE sample = \"{sample}\";")

    # create dictionary from the queried data
    for x in metadata_query: 

        metadata = {"AGE": x.AGE, "BBTYPE": x.BBTYPE, "ETHNICITY": x.ETHNICITY, "GENDER": x.GENDER, "LOCATION": x.LOCATION, "SAMPLEID": x.sample}

    #return a json format of metadata to js file
    return jsonify(metadata)
    

#initialize flask app; set debug=True, unable to deploy on Heroku
if __name__ == "__main__":
    app.run(debug=True)