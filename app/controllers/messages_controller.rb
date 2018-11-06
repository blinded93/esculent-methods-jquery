class MessagesController < ApplicationController
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
