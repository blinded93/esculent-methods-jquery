class MessagesController < ApplicationController
  def index
    user = User.find(params[:user_id])
    pagy, messages = pagy(user.received_messages, {items:25})
    render json: messages,
           meta: pagy,
           status: 200
  end

  def create
    binding.pry
  end

  def destroy
    user = User.find(params[:user_id])

    # delete stuff goes here

    render json: {message_ids:params[:message_ids]},
           status: 200
  end
end
