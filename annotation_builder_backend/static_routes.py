from flask import Blueprint, jsonify, request
import mysql.connector

# Connect to the static database
db = mysql.connector.connect(
    host="localhost",
    user="annotation_user",
    password="",
    database="",
