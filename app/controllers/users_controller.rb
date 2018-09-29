class UsersController < ApplicationController
  before_action :find_user, only: [:show, :update, :recipes, :favorites]

  def create
    user = User.new(user_params)
    user.save
    session[:user_id] = user.id
    render json: user, status: 200
  end

  def update
    user = User.find(params[:id].to_i)
    user.update(user_params)
    render json: user, status: 200
  end

  def show
    user = User.find(params[:id])
    render json: user, status: 200
  end

  def recipes
    user = User.find(params[:user_id])
    recipes = params[:preview] ? user.recipes.preview : user.recipes
    render json: recipes, status: 200
  end

  def favorites
    user = User.find(params[:user_id])
    favorites = params[:preview] ? user.favorites.preview : user.favorites
    render json: favorites, status: 200
  end

  def friends
    user = User.find(params[:user_id])
    friends = params[:preview] ? user.friends.preview : user.friends
    render json: friends, status: 200
  end

  private
    def user_params
      params.permit(:username, :email, :password, :avatar)
    end

    def find_user
      user = User.find_by_id(params[:user_id])
    end
end
