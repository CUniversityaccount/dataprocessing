#!/usr/bin/env python
# Name:
# Student number:
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title +
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # ADD YOUR CODE HERE TO EXTRACT THE ABOVE INFORMATION ABOUT THE
    # HIGHEST RATED MOVIES
    # NOTE: FOR THIS EXERCISE YOU ARE ALLOWED (BUT NOT REQUIRED) TO IGNORE
    # UNICODE CHARACTERS AND SIMPLY LEAVE THEM OUT OF THE OUTPUT.
    with open("movies.html", encoding = "utf-8") as fp:
        document = BeautifulSoup(fp)

    # set up all the data
    list_date_time = document.find_all('span')
    score = document.find_all('div')
    list_title_actors = document.find_all('a')
    title = document.find_all('a')

    # make all the lists
    movie_information = {}
    acteurs = ""
    title_list = []
    rating_list = []
    year_list = []
    acteurs_list = []
    runtime_list = []

    for link in list_title_actors:
        # searchs the acteur names
        if 'name' in link.get('href') and 'adv_li_st' in link.get('href'):
            acteur_names = link.string
            acteurs = acteurs + acteur_names + ', '


        # searchs the movie title
        elif 'title' in link.get('href') and 'adv_li_tt' in link.get('href') :
            # creates the first key for the dictionary
                movie = link.string
                title_list.append(movie)

                # makes new string of acteurs
                acteurs = acteurs[:-2]
                acteurs_list.append(acteurs)
                acteurs = ""

    # if 'ratings-imdb-rating' in link:
    for link in score:
        if link.get('data-value') != None:
            # count += 1
            rate = float(link.get('data-value'))
            rating_list.append(rate)

    # go through the rows to get the year and runtime
    for link in list_date_time:

        # get year
        if link.get('class') is not None and 'lister-item-year' in link.get('class'):
            # count += 1
            year = link.string
            year = ''.join([number for number in year if number.isdigit()])
            year_list.append(year)

        # get runtime
        elif link.get('class') is not None and 'runtime' in link.get('class'):
            runtime = link.string
            runtime = ''.join([number for number in runtime if number.isdigit()])
            runtime_list.append(runtime)

    # put the information in a dictionary
    for count in range(len(year_list)):
        movie_information["movie" + str(count + 1)] = []
        movie_information["movie" + str(count + 1)].extend((title_list[count], acteurs_list[count],
                                                            rating_list[count], year_list[count], runtime_list[count]))

    return movie_information

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """

    # print the information in a csv file
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Actors', 'Rating', 'Year', 'Runtime'])
    for values in movies.values():
        writer.writerow(values)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
