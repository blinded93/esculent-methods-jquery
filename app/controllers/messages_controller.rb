class MessagesController < ApplicationController
  def index
    user = User.find(params[:user_id])
    binding.pry
    pagy, messages = pagy(user.received_messages, {items:25})
    render json: messages,
           meta: pagy,
           status: 200
  end
end
