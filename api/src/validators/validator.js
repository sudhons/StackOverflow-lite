
class Validator {
  static validateNewUser(request, response, next) {
    const username = request.body.username && request.body.username.trim();
    const email = request.body.email && request.body.email.trim();
    const password = request.body.password && request.body.password.trim();

    if (!email || !password || !username) {
      const output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };

      response.status(422);
      return response.json(output);
    }

    if (username.length < 6) {
      const output = { status: 422, message: 'Unsuccessful. Username is too short' };

      response.status(422);
      return response.json(output);
    }

    if (password.length < 6) {
      const output = { status: 422, message: 'Unsuccessful. Password is too short' };

      response.status(422);
      return response.json(output);
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      const output = { status: 422, message: 'Unsuccessful. Email Invalid' };

      response.status(422);
      return response.json(output);
    }

    request.body.username = username;
    request.body.email = email.toLowerCase();
    request.body.password = password;
    return next();
  }

  static validateUser(request, response, next) {
    const username = request.body.username && request.body.username.trim();
    const password = request.body.password && request.body.password.trim();

    if (!password || !username) {
      const output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };

      response.status(422);
      return response.json(output);
    }

    request.body.username = username;
    request.body.password = password;
    return next();
  }

}

export default Validator;
