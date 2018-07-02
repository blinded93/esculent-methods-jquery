class UsersController < ApplicationController
  def show
    user = User.find(params[:user_id])
    render json: user, status: 200
  end
end
