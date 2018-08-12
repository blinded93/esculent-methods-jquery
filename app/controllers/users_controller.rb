class UsersController < ApplicationController
  before_action :find_user, only: [:show, :recipes, :favorites]
  
  def create
    user = User.new(user_params)
    user.save
    session[:user_id] = user.id
    render json: user, status: 200
  end

  def show
    user = User.find(params[:user_id])
    render json: user, status: 200
  end

  def recipes
    user = User.find(params[:user_id])
    render json: user.recipes, status: 200
  end

  def favorites
    user = User.find(params[:user_id])
    render json: user.favorites, status: 200
  end

  def friends
    user = User.find(params[:user_id])
    render json: user.friends, status: 200
  end

  private
  def user_params
    params.permit(:username, :email, :password)
  end

  def find_user
    user = User.find_by_id(params[:user_id])
  end
end
