# -*- coding: utf-8 -*-

# Sample Python code for youtube.activities.list
# See instructions for running these code samples locally:
# https://developers.google.com/explorer-help/code-samples#python

import os
import googleapiclient.discovery
import googleapiclient.errors

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

def get_last_set():
    # Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    api_service_name = "youtube"
    api_version = "v3"
    API_KEY = "AIzaSyBMrv12YHXd05C2rxva5ryR8ZWgzh9ZJPA"

    youtube = googleapiclient.discovery.build(
        api_service_name, api_version, developerKey=API_KEY)

    request = youtube.activities().list(
        part="snippet,contentDetails",
        channelId="UC9dkdsxI-gFqUaZrjGbahIA",
        maxResults=1
    )
    response = request.execute()
    
    id = response["items"][0]["contentDetails"]["upload"]["videoId"]
    title = response["items"][0]["snippet"]["title"]
    date = response["items"][0]["snippet"]["publishedAt"][:10]
    description = response["items"][0]["snippet"]["description"]
       
    artist = description[description.find(" : ") + 3 : description.find(" (")].split(',')
    collectif =  description[description.find("(") + 1 : description.find(")")].split('/')
    description = description[description.find("\n") + 2 : ]
    style = description[description.find(" : ") + 3 : description.find("\n")].split('/')
    
    separator = "\n\nTracklist :\n"
    separator_index = description.find(separator)
    separator_len = len(separator)
    tracklist = description[separator_index + separator_len:].replace('\n', ',')
    description = description[description.find("Présentation :\n") + 15 :separator_index]
    
    last_set = {'id' : id, 'title' : title, 'artist' : artist, 'collectif' : collectif, 'style' : style,'date' : date, 'description' : description, 'tracklist' : tracklist}

    return last_set

def update_bdd(last_set):
    from update_events import config
    from kenlod.models import Set, Style, Collectif, Artist
    
    config()
    sets = Set.objects.all().order_by('date')
    if not sets or last_set['id'] != sets[0].set_id :
        
        new_set = Set(titre = last_set['title'],
                        date = last_set['date'],
                        tracklist = last_set['tracklist'],
                        description = last_set['description'],
                        set_id = last_set['id'])
        new_set.save()
        
        for style in last_set['style']:
            style_object = Style.objects.filter(name = style)
            if not style_object:
                new_style = Style(name = style)
                new_style.save()
                style_object = Style.objects.filter(name = style)
            new_set.style.add(style_object[0])
            
        for collectif in last_set['collectif']:
            collectif_object = Collectif.objects.filter(name = collectif)
            if not collectif_object:
                new_collectif = Collectif(name = collectif)
                new_collectif.save()
                collectif_object = Collectif.objects.filter(name = collectif)
            new_set.collectif.add(collectif_object[0])

        for artist in last_set['artist']:
            artist_object = Artist.objects.filter(name = artist)
            if not artist_object:
                new_style = Artist(name = artist)
                new_style.save()
                artist_object = Artist.objects.filter(name = artist)
            new_set.artist.add(artist_object[0])
        
        new_set.save()
        
last_set = get_last_set()
update_bdd(last_set)