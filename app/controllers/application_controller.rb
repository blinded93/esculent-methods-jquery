class ApplicationController < ActionController::Base
  include Pagy::Backend

  def current_user
    @user ||= User.find_by_id(session[:user_id])
  end

  def logged_in?
    !!current_user
  end

  def error_if_not_logged_in
    if !logged_in?
      render json: {errors: "Must be logged in to do that"},
             status: 403
    end
  end
end
