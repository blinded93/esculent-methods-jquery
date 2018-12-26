class UsersController < ApplicationController
  before_action :error_if_not_logged_in, only: [:update, :friend, :messages]

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
    pagy, recipes = pagy_resp(params)

    render json: recipes,
           meta: pagy,
           status: 200
  end

  def favorites
    pagy, favorites = pagy_resp(params)

    render json: favorites,
           root: :favorites,
           meta: pagy,
           status: 200
  end

  def friends
    pagy, friends = pagy_resp(params)

    render json: friends,
           root: :friends,
           meta: pagy,
           status: 200
  end

  def messages
    message_scope = MessagesService.new(params, current_user)
    pagy, messages = pagy(message_scope.filter, {items:2,
                                                 assets:params[:action],
                                                 scope: params[:scope]})

    render json: messages,
           include: "**",
           meta: pagy,
           status: 200
  end

  def search
    meta, users = pagy(User.from_identifier(params[:query]), {
                      items: 2,
                      query:params[:query]
                      })

    render json: users,
           meta: meta,
           status: 200
  end

  private
    def user_params
      params.permit(:username, :email, :password, :avatar)
    end

    def pagy_resp(params)
      user = User.find(params[:user_id])
      assets, items = if params[:preview]
                        [user.send(params[:action]).preview, {}]
                      else
                        [user.send(params[:action]), {items:5}]
                      end

      pagy(assets, items)
    end
end
