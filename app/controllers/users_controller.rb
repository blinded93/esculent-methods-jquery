class UsersController < ApplicationController
  def create
    user = User.new(user_params)
    user.save
    render json: user, status: 200
  end

  def show
    user = User.find(params[:user_id])
    render json: user, status: 200
  end

  private
  def user_params
    params.permit(:username, :email, :password)
  end
end
