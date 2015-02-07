var assert = require('assert')
  , auth = require('../../lib/auth')
  , middleware = require('../../lib/middleware')
  , should = require('should')
  ;

describe('middleware', function() {
  describe('#require_admin()', function() {
    it('should only be accessible to admin user', function() {
      var mock_req = {user: {}};
      var response_api = {end: function() {}};

      middleware.require_admin(mock_req, response_api, function() { response_api.statusCode = 200 });

      response_api.statusCode.should.eql(401);

      mock_req = {user: {account_level:1}};
      middleware.require_admin(mock_req, response_api, function() { response_api.statusCode = 200 });

      response_api.statusCode.should.eql(200);
    });
  });
  describe('#require_auth()', function() {
    it('should only be accessible to authenticated user', function() {
      var mock_req = {};
      var response_api = {end: function() {}};

      middleware.require_auth(mock_req, response_api, function() { response_api.statusCode = 401 });

      response_api.statusCode.should.eql(401);

      mock_req = {user: {account_level:1}};
      middleware.require_admin(mock_req, response_api, function() { response_api.statusCode = 200 });

      response_api.statusCode.should.eql(200);
    });
  });

  describe("#requireBody()", function() {
    it("should fallthrough if all params are present", function() {
      var mock_req = {
        body: {
          email: "user@email.com",
          name: "New Guy"
        }
      };
      var response_api = {end: function() {}};

      middleware.requireBody(["email", "name"])(mock_req, response_api,
        function() { response_api.statusCode = 200 });

      response_api.statusCode.should.eql(200);
    });

    it("should error if at least one params is missing", function() {
      var mock_req = {
        body: {
          name: "New Guy"
        }
      };
      var body;
      var response_api = {end: function(b) {body = b;}};

      middleware.requireBody(["email", "name"])(mock_req, response_api,
        function() { response_api.statusCode = 200 });

      response_api.statusCode.should.eql(400);
      response_api.statusCode = 0;
      var data = JSON.parse(body);
      data.errors.length.should.eql(1);
    });

    it("should error if multiple params are missing", function() {
      var mock_req = {
        body: {}
      };
      var body;
      var response_api = {end: function(b) {body = b;}};

      middleware.requireBody(["email", "name"])(mock_req, response_api,
        function() { response_api.statusCode = 200 });

      response_api.statusCode.should.eql(400);
      response_api.statusCode = 0;
      var data = JSON.parse(body);
      data.errors.length.should.eql(2);
    });
  });
});
