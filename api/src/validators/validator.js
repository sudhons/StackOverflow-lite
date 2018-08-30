
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

    if (username.length > 30) {
      const output = { status: 422, message: 'Unsuccessful. Username is too long' };

      response.status(422);
      return response.json(output);
    }

    if (password.length < 6) {
      const output = { status: 422, message: 'Unsuccessful. Password is too short' };

      response.status(422);
      return response.json(output);
    }

    if (password.length > 100) {
      const output = { status: 422, message: 'Unsuccessful. Password is too long' };

      response.status(422);
      return response.json(output);
    }

    if (email.length > 30) {
      const output = { status: 422, message: 'Unsuccessful. Email is too long' };

      response.status(422);
      return response.json(output);
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      const output = { status: 422, message: 'Unsuccessful. Email is not valid' };

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

  static authorizeUser(request, response, next) {
    const token = request.headers.authorization;
    if (!token) {
      const output = { status: 403, message: 'Not authorized' };
      response.status(403);
      return response.json(output);
    }

    request.token = token;
    return next();
  }

  static validateQuestion(request, response, next) {
    const title = request.body.title && request.body.title.trim();
    const questionBody = request.body.question && request.body.question.trim();

    if (!title || !questionBody) {
      const output = { status: 422, message: 'Unsuccessful. Please ensure all required inputs are supplied and correct' };

      response.status(422);
      return response.json(output);
    }

    if (title.length < 15) {
      const output = { status: 422, message: 'Unsuccessful. Title is too short' };

      response.status(422);
      return response.json(output);
    }

    if (title.length > 120) {
      const output = { status: 422, message: 'Unsuccessful. Title is too long' };

      response.status(422);
      return response.json(output);
    }

    if (questionBody.length < 30) {
      const output = { status: 422, message: 'Unsuccessful. question is too short' };

      response.status(422);
      return response.json(output);
    }

    if (questionBody.length > 400) {
      const output = { status: 422, message: 'Unsuccessful. question is too long' };

      response.status(422);
      return response.json(output);
    }

    request.body.title = title;
    request.body.question = questionBody;

    return next();
  }
}

export default Validator;
