# Viper
[![Code Climate](https://codeclimate.com/github/aaronjwood/viper/badges/gpa.svg)](https://codeclimate.com/github/aaronjwood/viper)
[![Codacy Badge](https://api.codacy.com/project/badge/grade/b4709b23f8a94b83a6b80b5e9a1ac4e6)](https://www.codacy.com/app/aaronjwood/viper)

Real-time tracking and analytics using Node.js and Socket.IO.

The purpose of this analytics program is not to track and accumulate data over time but to present various metrics of your users in real-time.

What do I mean by real-time?
For browsers that support [native web sockets](http://caniuse.com/websockets) we're talking about a full-duplex TCP connection that typically has less than 100ms of latency.

There is currently no database behind Viper. The main goal of Viper is to work with and present real-time data.
Everything is persisted inside of the server which means that all data will be lost if the server is stopped.
This isn't necessarily an issue if the server is spun back up in a short amount of time following when it was taken down.
Your clients should reconnect without you having to do anything. This ensures that you get your real-time data back as soon as possible.
By default, clients will always try to reconnect to the server while utilizing exponential backoff to avoid connection flooding.
This means that if the server is taken down for a few hours and the same clients remain on the location of where the tracking code is installed, the clients will eventually reconnect when the server is back online.

# Tracking Code

The tracking code can be referenced at `/js/tracking.js` which makes it nice and easy to use anywhere you want with a script tag.