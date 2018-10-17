class UsersController < ApplicationController
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
           meta: pagy,
           status: 200
  end

  def friends
    if params[:recipients]
      friends = current_user.friends.select(:id, :username)
      render json: friends,
             each_serializer: MessageRecipientSerializer,
             status: 200
    else
      pagy, friends = pagy_resp(params)
      render json: friends,
             meta: pagy,
             status: 200
    end
  end

  def messages
    user = User.find(params[:user_id])
    scope_message = MessageService.new(params, user)
    pagy, messages = pagy(scope_message.filter, {items:25})
    render json: messages,
           meta: pagy,
           status: 200
  end

  def search
    meta, users = pagy(User.from_identifier(params[:query]), {items: 3, query:params[:query]})
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
