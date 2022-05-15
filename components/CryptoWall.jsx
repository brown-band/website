module.exports = () => (
  <>
    <p>
      The page you are trying to view is password protected. Enter the password
      below to proceed. If you have any questions, please email
      band_web@brown.edu.
    </p>
    <form onsubmit="decrypt(); return false">
      <label for="passwordInput" class="form-label">
        Enter the password here, please.
      </label>
      <div class="d-flex flex-column flex-md-row gap-3">
        <div class="flex-grow-1">
          <input
            type="password"
            class="form-control"
            autofocus
            id="passwordInput"
            placeholder="hunter2"
          />
          <div class="invalid-feedback">
            Incorrect Password. Try again or email band_web@brown.edu!
          </div>
        </div>
        <div style="display: flex; align-items: flex-start">
          <button class="btn btn-primary decrypt-button" type="submit" disabled>
            Press This Button!
          </button>
        </div>
      </div>
    </form>
  </>
);
