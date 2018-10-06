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
    pagy, recipes = pagy(params[:preview] ? user.recipes.preview : user.recipes, {items: 2})
    render json: recipes,
           meta: pagy,
           status: 200
  end

  def favorites
    user = User.find(params[:user_id])
    pagy, favorites = pagy(params[:preview] ? user.favorites.preview : user.favorites, {items: 2})
    render json: favorites,
           meta: pagy,
           status: 200
  end

  def friends
    user = User.find(params[:user_id])
    pagy, friends = pagy(params[:preview] ? user.friends.preview : user.friends, {items: 5})
    render json: friends,
           meta: pagy,
           status: 200
  end

  def search
    meta, users = pagy(User.search(params[:query]), {items: 3, query:params[:query]})
    render json: users,
           meta: meta,
           status: 200
  end

  private
    def user_params
      params.permit(:username, :email, :password, :avatar)
    end

    def find_user
      user = User.find_by_id(params[:user_id])
    end
end
