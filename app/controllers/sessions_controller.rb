class SessionsController < ApplicationController

  def current_session_user
    if current_user
      render json: current_user, status: 200
    end
  end

  def create
    s = SessionService.create_and_authenticate(params)
    s.set_current_user(session)
    render json: s.result, status: 200
  end

  def destroy
    if current_user
      session.delete(:user_id)
    end
  end
end
