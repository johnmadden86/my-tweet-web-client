define('app',['exports', 'aurelia-framework', 'aurelia-event-aggregator', './services/messages', './services/tweet-service'], function (exports, _aureliaFramework, _aureliaEventAggregator, _messages, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default, _aureliaFramework.Aurelia, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function App(ts, au, ea) {
      var _this = this;

      _classCallCheck(this, App);

      this.au = au;
      this.ts = ts;
      ea.subscribe(_messages.LoginStatus, function (msg) {
        _this.router.navigate('/', { replace: true, trigger: false });
        _this.router.reset();
        if (msg.status === true) {
          au.setRoot('home');
        } else {
          au.setRoot('app');
        }
      });
    }

    App.prototype.attached = function attached() {
      var _this2 = this;

      if (this.ts.isAuthenticated()) {
        this.au.setRoot('home').then(function () {
          _this2.router.navigateToRoute('new-tweet');
        });
      }
    };

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: ['', 'login'], name: 'login', moduleId: 'view-models/login/login', nav: true, title: 'Login' }, { route: 'sign-up', name: 'sign-up', moduleId: 'view-models/sign-up/sign-up', nav: true, title: 'Sign Up' }]);
      this.router = router;
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('home',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.Aurelia), _dec(_class = function () {
    function Home(au) {
      _classCallCheck(this, Home);

      this.aurelia = au;
    }

    Home.prototype.configureRouter = function configureRouter(config, router) {
      config.map([{ route: ['', 'home'], name: 'new-tweet', moduleId: 'view-models/new-tweet/new-tweet', nav: true, title: 'New Tweet' }, { route: 'timeline', name: 'timeline', moduleId: 'view-models/timeline/timeline', nav: true, title: 'Timeline' }, { route: 'profile', name: 'profile', moduleId: 'view-models/profile/profile', nav: true, title: 'Profile' }, { route: 'users', name: 'users', moduleId: 'view-models/users/users', nav: true, title: 'Users' }, { route: 'account', name: 'account', moduleId: 'view-models/account/account', nav: true, title: 'Account' }, { route: 'logout', name: 'logout', moduleId: 'view-models/logout/logout', nav: true, title: 'Logout' }]);
      this.router = router;

      config.mapUnknownRoutes(function (instruction) {
        return 'home';
      });
    };

    return Home;
  }()) || _class);
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/async-http-client',['exports', 'aurelia-framework', 'aurelia-http-client', './fixtures', 'aurelia-event-aggregator', './messages'], function (exports, _aureliaFramework, _aureliaHttpClient, _fixtures, _aureliaEventAggregator, _messages) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _fixtures2 = _interopRequireDefault(_fixtures);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var AsyncHttpClient = (_dec = (0, _aureliaFramework.inject)(_aureliaHttpClient.HttpClient, _fixtures2.default, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function AsyncHttpClient(httpClient, fixtures, ea) {
      _classCallCheck(this, AsyncHttpClient);

      this.http = httpClient;
      this.http.configure(function (http) {
        http.withBaseUrl(fixtures.baseUrl);
      });
      this.ea = ea;
    }

    AsyncHttpClient.prototype.get = function get(url) {
      return this.http.get(url);
    };

    AsyncHttpClient.prototype.post = function post(url, obj) {
      return this.http.post(url, obj);
    };

    AsyncHttpClient.prototype.delete = function _delete(url) {
      return this.http.delete(url);
    };

    AsyncHttpClient.prototype.authenticate = function authenticate(url, user) {
      var _this = this;

      this.http.post(url, user).then(function (response) {
        var status = response.content;
        localStorage.tweet = JSON.stringify(status);
        if (status.success) {
          console.log('authentication successful');
          _this.http.configure(function (configuration) {
            configuration.withHeader('Authorization', status.token);
          });
        }
        _this.ea.publish(new _messages.LoginStatus(status));
        _this.ea.publish(new _messages.LoggedInUser(status.user));
      }).catch(function (error) {
        var status = {
          success: false,
          message: 'service not available'
        };
        console.log('authentication unsuccessful');
        _this.ea.publish(new _messages.LoginStatus(status));
      });
    };

    AsyncHttpClient.prototype.clearAuthentication = function clearAuthentication() {
      localStorage.tweet = null;
      this.http.configure(function (configuration) {
        configuration.withHeader('Authorization', '');
      });
    };

    AsyncHttpClient.prototype.isAuthenticated = function isAuthenticated() {
      var authenticated = false;
      if (localStorage.donation !== 'null') {
        authenticated = true;
        this.http.configure(function (http) {
          var auth = JSON.parse(localStorage.tweet);
          http.withHeader('Authorization', 'bearer ' + auth.token);
        });
      }
      return authenticated;
    };

    return AsyncHttpClient;
  }()) || _class);
  exports.default = AsyncHttpClient;
});
define('services/fixtures',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Fixtures = function Fixtures() {
    _classCallCheck(this, Fixtures);

    this.baseUrl = 'https://lit-plains-67430.herokuapp.com';
  };

  exports.default = Fixtures;
});
define('services/messages',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var LoginStatus = exports.LoginStatus = function LoginStatus(status) {
    _classCallCheck(this, LoginStatus);

    this.status = status;
  };

  var LoggedInUser = exports.LoggedInUser = function LoggedInUser(user) {
    _classCallCheck(this, LoggedInUser);

    this.user = user;
  };
});
define('services/tweet-service',['exports', 'aurelia-framework', './fixtures', './messages', 'aurelia-event-aggregator', './async-http-client'], function (exports, _aureliaFramework, _fixtures, _messages, _aureliaEventAggregator, _asyncHttpClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;

  var _fixtures2 = _interopRequireDefault(_fixtures);

  var _asyncHttpClient2 = _interopRequireDefault(_asyncHttpClient);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var TweetService = (_dec = (0, _aureliaFramework.inject)(_fixtures2.default, _aureliaEventAggregator.EventAggregator, _asyncHttpClient2.default), _dec(_class = function () {
    function TweetService(data, ea, ac) {
      var _this = this;

      _classCallCheck(this, TweetService);

      this.currentUser = {};
      this.allUsers = [];
      this.tweet = {};
      this.allTweets = [];
      this.profileTweets = [];
      this.timelineTweets = [];

      this.ea = ea;
      this.ac = ac;

      ea.subscribe(_messages.LoggedInUser, function (msg) {
        _this.currentUser = msg.user;
        _this.getAllTweetsForUser(msg.user._id);
        _this.getTimeline(msg.user._id);
        _this.getUsers();
        console.log('current user: ' + _this.currentUser.firstName + ' ' + _this.currentUser.lastName);
      });
    }

    TweetService.prototype.register = function register(firstName, lastName, email, password) {
      var _this2 = this;

      var newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
      this.ac.post('/api/users', newUser).then(function (res) {
        _this2.getUsers();
      });
    };

    TweetService.prototype.registerNewAdmin = function registerNewAdmin(firstName, lastName, email, password) {
      var _this3 = this;

      var newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
      this.ac.post('/api/users/admin', newUser).then(function (res) {
        _this3.getUsers();
      });
    };

    TweetService.prototype.login = function login(email, password) {
      var user = {
        email: email,
        password: password
      };
      this.ac.authenticate('/api/users/authenticate', user);
    };

    TweetService.prototype.logout = function logout() {
      var status = {
        success: false,
        message: ''
      };
      this.ac.clearAuthentication();
      this.ea.publish(new _messages.LoginStatus(status));
    };

    TweetService.prototype.isAuthenticated = function isAuthenticated() {
      return this.ac.isAuthenticated();
    };

    TweetService.prototype.getUsers = function getUsers() {
      var _this4 = this;

      this.ac.get('/api/users').then(function (res) {
        _this4.allUsers = res.content;
      });
    };

    TweetService.prototype.getUser = function getUser(id) {
      var _this5 = this;

      this.ac.get('/api/users/' + id).then(function (res) {
        _this5.user = res.content;
      });
    };

    TweetService.prototype.getAdmins = function getAdmins() {
      var _this6 = this;

      this.ac.get('/api/users/admin').then(function (res) {
        _this6.users = res.content;
      });
    };

    TweetService.prototype.getNonAdmin = function getNonAdmin() {
      var _this7 = this;

      this.ac.get('/api/users/~').then(function (res) {
        _this7.users = res.content;
      });
    };

    TweetService.prototype.deleteOneUser = function deleteOneUser(id) {
      var _this8 = this;

      this.ac.delete('/api/users/' + id).then(function (res) {
        _this8.users = _this8.getUsers();
      });
    };

    TweetService.prototype.deleteAllUsers = function deleteAllUsers() {
      var _this9 = this;

      this.ac.delete('/api/users/').then(function (res) {
        _this9.users = _this9.getUsers();
      });
    };

    TweetService.prototype.updateUserDetails = function updateUserDetails(id, details) {
      var _this10 = this;

      this.ac.post('/api/users/' + id, details).then(function (res) {
        _this10.currentUser = res.content;
        _this10.users = _this10.getUsers();
      });
    };

    TweetService.prototype.newTweet = function newTweet(text) {
      var _this11 = this;

      var tweet = {
        text: text
      };
      console.log('attempting to post new tweet');
      this.ac.post('/api/tweets', tweet).then(function (res) {
        _this11.profileTweets.unshift(res.content);
        _this11.getAllTweetsForUser(_this11.currentUser._id);
      });
    };

    TweetService.prototype.getTweets = function getTweets() {
      var _this12 = this;

      this.ac.get('/api/tweets').then(function (res) {
        _this12.allTweets = res.content;
      });
    };

    TweetService.prototype.getTweet = function getTweet(id) {
      this.ac.get('/api/tweets/' + id).then(function (res) {});
    };

    TweetService.prototype.deleteOneTweet = function deleteOneTweet(id) {
      var _this13 = this;

      this.ac.delete('/api/tweets/' + id).then(function (res) {
        _this13.tweets = _this13.getTweets();
      });
    };

    TweetService.prototype.deleteAllTweets = function deleteAllTweets() {
      var _this14 = this;

      this.ac.delete('/api/tweets/').then(function (res) {
        _this14.tweets = _this14.getTweets();
      });
    };

    TweetService.prototype.follow = function follow(id, followId) {
      var _this15 = this;

      this.ac.get('/api/users/' + id + '/follow?_id=' + followId).then(function (res) {
        _this15.users = _this15.getUsers();
      });
    };

    TweetService.prototype.unfollow = function unfollow(id, followId) {
      var _this16 = this;

      this.ac.get('/api/users/' + id + '/unfollow?_id=' + followId).then(function (res) {
        _this16.users = _this16.getUsers();
      });
    };

    TweetService.prototype.getAllTweetsForUser = function getAllTweetsForUser(userId) {
      var _this17 = this;

      this.ac.get('/api/users/' + userId + '/tweets').then(function (res) {
        _this17.profileTweets = res.content;
      });
    };

    TweetService.prototype.deleteAllTweetsForUser = function deleteAllTweetsForUser(userId) {
      var _this18 = this;

      this.ac.delete('/api/users/' + userId + '/tweets').then(function (res) {
        _this18.tweets = _this18.getTweets();
      });
    };

    TweetService.prototype.getTimeline = function getTimeline(userId) {
      var _this19 = this;

      this.ac.get('/api/users/' + userId + '/timeline').then(function (res) {
        _this19.timelineTweets = res.content;
      });
    };

    return TweetService;
  }()) || _class);
  exports.default = TweetService;
});
define('view-models/account/account',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Account = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Account = exports.Account = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function Account(ts) {
      _classCallCheck(this, Account);

      this.details = {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      };

      this.tweetService = ts;
      this.id = this.tweetService.currentUser._id;
      this.details.firstName = this.tweetService.currentUser.firstName;
      this.details.lastName = this.tweetService.currentUser.lastName;
      this.details.email = this.tweetService.currentUser.email;
      this.details.password = this.tweetService.currentUser.password;
    }

    Account.prototype.updateDetails = function updateDetails(e) {
      console.log(this.id, this.details);
      this.tweetService.updateUserDetails(this.id, this.details);
    };

    return Account;
  }()) || _class);
});
define('view-models/dashboard/dashboard',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Dashboard = exports.Dashboard = function Dashboard() {
    _classCallCheck(this, Dashboard);
  };
});
define('view-models/login/login',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function Login(ts) {
      _classCallCheck(this, Login);

      this.email = 'homer@simpson.com';
      this.password = 'secret';

      this.tweetService = ts;
    }

    Login.prototype.login = function login(e) {
      console.log('Trying to log in ' + this.email);
      this.tweetService.login(this.email, this.password);
    };

    return Login;
  }()) || _class);
});
define('view-models/logout/logout',['exports', '../../services/tweet-service', 'aurelia-framework'], function (exports, _tweetService, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function Logout(ts) {
      _classCallCheck(this, Logout);

      this.tweetService = ts;
    }

    Logout.prototype.logout = function logout() {
      console.log('logging out');
      this.tweetService.logout();
    };

    return Logout;
  }()) || _class);
});
define('view-models/new-tweet/new-tweet',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NewTweet = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var NewTweet = exports.NewTweet = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function NewTweet(ts) {
      _classCallCheck(this, NewTweet);

      this.text = 'Hello world!';

      this.tweetService = ts;
    }

    NewTweet.prototype.newTweet = function newTweet() {
      this.tweetService.newTweet(this.text);
    };

    return NewTweet;
  }()) || _class);
});
define('view-models/profile/profile',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Profile = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Profile = exports.Profile = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function Profile(ts) {
    _classCallCheck(this, Profile);

    this.tweets = [];

    this.tweetService = ts;
    this.tweets = this.tweetService.profileTweets;
    this.tweets.forEach(function (tweet) {
      tweet.author.fullName = tweet.author.firstName + ' ' + tweet.author.lastName;
    });
  }) || _class);
});
define('view-models/sign-up/sign-up',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SignUp = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var SignUp = exports.SignUp = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function () {
    function SignUp(ts) {
      _classCallCheck(this, SignUp);

      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';

      this.tweetService = ts;
    }

    SignUp.prototype.register = function register(e) {
      this.tweetService.register(this.firstName, this.lastName, this.email, this.password);
      this.tweetService.login(this.email, this.password);
    };

    return SignUp;
  }()) || _class);
});
define('view-models/timeline/timeline',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Timeline = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Timeline = exports.Timeline = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function Timeline(ts) {
    _classCallCheck(this, Timeline);

    this.tweets = [];

    this.tweetService = ts;
    this.tweets = this.tweetService.timelineTweets;
    this.tweets.forEach(function (tweet) {
      tweet.author.fullName = tweet.author.firstName + ' ' + tweet.author.lastName;
    });
  }) || _class);
});
define('view-models/users/users',['exports', 'aurelia-framework', '../../services/tweet-service'], function (exports, _aureliaFramework, _tweetService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Users = undefined;

  var _tweetService2 = _interopRequireDefault(_tweetService);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Users = exports.Users = (_dec = (0, _aureliaFramework.inject)(_tweetService2.default), _dec(_class = function Users(ts) {
    _classCallCheck(this, Users);

    this.users = [];

    this.tweetService = ts;
    this.users = this.tweetService.allUsers;
    this.users.forEach(function (user) {
      user.fullName = user.firstName + ' ' + user.lastName;
    });
  }) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"nav-bar.html\"></require>\n  <div class=\"ui container page-host\">\n    <nav-bar router.bind=\"router\"></nav-bar>\n    <router-view></router-view>\n  </div>\n</template>\n"; });
define('text!nav-bar.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\n  <nav class=\"ui inverted menu\">\n    <header class=\"header item\"><a href=\"/\"> MyTweetWeb </a></header>\n    <div class=\"right menu\">\n      <div repeat.for=\"row of router.navigation\">\n        <a class=\"${row.isActive ? 'active' : ''} item\"  href.bind=\"row.href\">${row.title}</a>\n      </div>\n    </div>\n  </nav>\n</template>\n"; });
define('text!view-models/account/account.html', ['module'], function(module) { module.exports = "<template>\n  <form submit.delegate=\"updateDetails($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Update details</h3>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>First Name</label>\n        <input placeholder=\"First Name\" type=\"text\" value.bind=\"details.firstName\">\n      </div>\n      <div class=\"field\">\n        <label>Last Name</label>\n        <input placeholder=\"Last Name\" type=\"text\" value.bind=\"details.lastName\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Email</label>\n      <input placeholder=\"Email\" type=\"text\" value.bind=\"details.email\">\n    </div>\n    <div class=\"field\">\n      <label>Password</label>\n      <input type=\"password\" value.bind=\"details.password\">\n    </div>\n    <button class=\"ui blue submit button\">Submit</button>\n  </form>\n</template>\n"; });
define('text!view-models/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\n  <section class=\"ui grid segment\">\n    <div class=\"four wide column\">\n      <compose view-model=\"../new-tweet/new-tweet\"></compose>\n    </div>\n    <div class=\"four wide column\">\n      <compose view-model=\"../timeline/timeline\"></compose>\n    </div>\n  </section>\n</template>\n"; });
define('text!view-models/login/login.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.delegate=\"login($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Log-in</h3>\n    <div class=\"field\">\n      <label>Email</label> <input placeholder=\"Email\" value.bind=\"email\"/>\n    </div>\n    <div class=\"field\">\n      <label>Password</label> <input type=\"password\" value.bind=\"password\"/>\n    </div>\n    <button class=\"ui blue submit button\">Login</button>\n    <h3>${prompt}</h3>\n  </form>\n\n</template>\n"; });
define('text!view-models/logout/logout.html', ['module'], function(module) { module.exports = "<template>\n\n  <form submit.delegate=\"logout($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Are you sure you want to log out?</h3>\n    <button class=\"ui blue submit button\">Logout</button>\n  </form>\n\n</template>\n"; });
define('text!view-models/new-tweet/new-tweet.html', ['module'], function(module) { module.exports = "<template router.bind=\"router\">\n  <section class=\"ui two column stackable grid basic segment\">\n\n    <form submit.trigger=\"newTweet()\" class=\"ui form four wide column stacked segment\">\n\n      <div class=\"grouped inline fields\">\n        <h3>Enter Text </h3>\n        <div class=\"field\">\n          <label>Tweet</label> <input type=\"text\" value.bind=\"text\">\n        </div>\n      </div>\n      <button class=\"ui blue submit button\">Send Tweet</button>\n\n    </form>\n\n  </section>\n</template>\n"; });
define('text!view-models/profile/profile.html', ['module'], function(module) { module.exports = "<template>\n\n  <section class=\"ui stacked segment\">\n    <article class=\"eight wide column\">\n      <table class=\"ui celled table segment\">\n        <thead>\n        <tr>\n          <th>Text</th>\n          <th>Date</th>\n          <th>Author</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr repeat.for=\"tweet of tweets\">\n          <td>${tweet.text}</td>\n          <td>${tweet.date}</td>\n          <td>${tweet.author.fullName}</td>\n        </tr>\n        </tbody>\n      </table>\n    </article>\n  </section>\n\n</template>\n"; });
define('text!view-models/sign-up/sign-up.html', ['module'], function(module) { module.exports = "<template>\n  <form submit.delegate=\"register($event)\" class=\"ui stacked segment form\">\n    <h3 class=\"ui header\">Register</h3>\n    <div class=\"two fields\">\n      <div class=\"field\">\n        <label>First Name</label>\n        <input placeholder=\"First Name\" type=\"text\" value.bind=\"firstName\">\n      </div>\n      <div class=\"field\">\n        <label>Last Name</label>\n        <input placeholder=\"Last Name\" type=\"text\" value.bind=\"lastName\">\n      </div>\n    </div>\n    <div class=\"field\">\n      <label>Email</label>\n      <input placeholder=\"Email\" type=\"text\" value.bind=\"email\">\n    </div>\n    <div class=\"field\">\n      <label>Password</label>\n      <input type=\"password\" value.bind=\"password\">\n    </div>\n    <button class=\"ui blue submit button\">Submit</button>\n  </form>\n</template>\n"; });
define('text!view-models/timeline/timeline.html', ['module'], function(module) { module.exports = "<template>\n\n  <section class=\"ui stacked segment\">\n    <article class=\"eight wide column\">\n      <table class=\"ui celled table segment\">\n        <thead>\n        <tr>\n          <th>Text</th>\n          <th>Date</th>\n          <th>Author</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr repeat.for=\"tweet of tweets\">\n          <td>${tweet.text}</td>\n          <td>${tweet.date}</td>\n          <td>${tweet.author.fullName}</td>\n        </tr>\n        </tbody>\n      </table>\n    </article>\n  </section>\n\n</template>\n"; });
define('text!view-models/users/users.html', ['module'], function(module) { module.exports = "<template>\n\n  <section class=\"ui stacked segment\">\n    <article class=\"eight wide column\">\n      <table class=\"ui celled table segment\">\n        <thead>\n        <tr>\n          <th>User</th>\n          <th></th>\n          <th></th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr repeat.for=\"user of users\">\n          <td>${user.fullName}</td>\n          <td></td>\n          <td></td>\n        </tr>\n        </tbody>\n      </table>\n    </article>\n  </section>\n\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map